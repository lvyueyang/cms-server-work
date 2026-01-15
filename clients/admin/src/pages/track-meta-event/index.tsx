import { ModalType, useFormModal } from '@/hooks/useFormModal';
import {
  TrackMetaEventCreateDto,
  TrackMetaEventInfo,
  TrackMetaEventUpdateDto,
} from '@cms/api-interface';
import { transformPagination } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Drawer, Form, Input, Popconfirm, Space, message } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { PropertiesSelect } from '../track-meta-properties/module/Select';
import PageTable from '@/components/PageTable';

type TableItem = TrackMetaEventInfo;

export default function TrackMetaEventListPage() {
  const [searchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: 260,
    },
    {
      dataIndex: 'cname',
      title: '显示名称',
      width: 200,
    },
    {
      dataIndex: 'desc',
      title: '描述',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      dataIndex: 'properties',
      title: '属性',
      search: false,
      width: 160,
      render: (_, row) => {
        return row.properties?.map((p) => p.cname)?.join(',');
      },
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      search: false,
      width: 180,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      search: false,
      width: 180,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      search: false,
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                formModal.form.resetFields();
                formModal.form.setFieldsValue({
                  ...row,
                  properties: row.properties?.map((p) => p.name),
                });
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个元事件吗？"
              onConfirm={() => {
                const close = message.loading('删除中...', 0);
                removeApi(row.id)
                  .then(() => {
                    message.success('删除成功');
                    tableRef.current?.reload();
                  })
                  .finally(() => {
                    close();
                  });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const formModal = useFormModal<TrackMetaEventCreateDto & { id?: number }>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE && values.id) {
        return updateApi({
          ...values,
        } as TrackMetaEventUpdateDto).then(() => {
          tableRef.current?.reload();
        });
      }
      console.log('values: ', values);

      return createApi(values).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  return (
    <>
      <PageTable<TableItem>
        columns={columns}
        request={(params) => {
          return getListApi({ ...transformPagination(params), ...searchForm }).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              formModal.formModalShow();
            }}
          >
            新增元事件
          </Button>,
        ]}
      />
      <Drawer
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}`}
        onClose={formModal.formModalClose}
        size={700}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10 }}>
            <Button onClick={formModal.formModalClose}>取消</Button>
            <Button
              onClick={formModal.submitHandler}
              type="primary"
              loading={formModal.submitLoading}
            >
              确定
            </Button>
          </div>
        }
      >
        <br />
        <Form
          form={formModal.form}
          labelCol={{ flex: '70px' }}
          initialValues={{ is_stable: false }}
        >
          {formModal.formModal.type === ModalType.UPDATE && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cname" label="显示名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="properties" label="属性">
            <PropertiesSelect />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
