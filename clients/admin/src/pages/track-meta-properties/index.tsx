import { ModalType, useFormModal } from '@/hooks/useFormModal';
import {
  TrackMetaPropertiesCreateDto,
  TrackMetaPropertiesInfo,
  TrackMetaPropertiesUpdateDto,
} from '@cms/api-interface';
import { enumMapToOptions, transformPagination } from '@/utils';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Popconfirm, Select, Space } from 'antd';
import { useRef, useState } from 'react';
import { META_PROPERTIES_TYPE, META_PROPERTIES_TYPE_MAP } from '@cms/server/const';
import { createApi, getListApi, removeApi, updateApi } from './module';
import PageTable from '@/components/PageTable';

type TableItem = TrackMetaPropertiesInfo;

export default function TrackMetaPropertiesListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'name',
      title: '属性名',
      width: 140,
    },
    {
      dataIndex: 'cname',
      title: '显示名称',
      width: 140,
    },
    {
      dataIndex: 'type',
      title: '类型',
      width: 90,
      render: (_, row) => {
        return META_PROPERTIES_TYPE_MAP.get(row.type as META_PROPERTIES_TYPE)?.label;
      },
      search: false,
    },
    {
      dataIndex: 'desc',
      title: '描述',
      width: 200,
      ellipsis: true,
      search: false,
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
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个元属性吗？"
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
  const formModal = useFormModal<TrackMetaPropertiesCreateDto & { id?: number }>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE && values.id) {
        return updateApi({
          ...values,
        } as TrackMetaPropertiesUpdateDto).then(() => {
          tableRef.current?.reload();
        });
      }

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
          return getListApi({ ...params, ...transformPagination(params), ...searchForm }).then(
            ({ data }) => {
              return { data: data.data.list, total: data.data.total || 0 };
            },
          );
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
            新增元属性
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
        width={500}
      >
        <br />
        <Form
          form={formModal.form}
          initialValues={{ is_stable: false }}
          labelCol={{ flex: '60px' }}
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
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={enumMapToOptions(META_PROPERTIES_TYPE_MAP)} style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
