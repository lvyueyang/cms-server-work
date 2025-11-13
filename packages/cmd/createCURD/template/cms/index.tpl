import { AvailableSwitch } from '@/components/Available';
import { {{entityName}}CreateDto, {{entityName}}Info, {{entityName}}UpdateDto } from '@cms/api-interface';
import { transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadImage from '@/components/UploadImage';
import { RecommendFormItem } from '@/components/RecommendFormItem';

type TableItem = {{entityName}}Info;
type CreateFormValues = {{entityName}}CreateDto;
type UpdateFormValues = {{entityName}}UpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

export default function {{entityName}}Page() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const formModal = useFormModal<FormValues>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE) {
        return updateApi(values as UpdateFormValues).then(() => {
          tableRef.current?.reload();
        });
      }
      return createApi(values as CreateFormValues).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'cover',
      title: '缩略图',
      width: 60,
      valueType: 'image',
    },
    {
      dataIndex: 'title',
      title: '名称',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'recommend',
      title: '推荐等级',
      sorter: true,
      width: 100,
    },
    {
      dataIndex: 'is_available',
      title: '是否可用',
      width: 100,
      render: (_, row) => {
        return (
          <AvailableSwitch
            value={row.is_available}
            tableRef={tableRef}
            request={() =>
              updateApi({
                id: row.id,
                is_available: !row.is_available,
              })
            }
          />
        );
      },
    },
    {
      dataIndex: 'desc',
      title: '描述',
      width: 260,
      ellipsis: true,
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      width: 180,
      sorter: true,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      sorter: true,
      width: 180,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个{{cname}}吗？"
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

  return (
    <>
      <ProTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        request={(params, sorter) => {
          return getListApi({
            ...transformPagination(params),
            ...transformSort(sorter),
            ...searchForm,
          }).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        headerTitle={
          <Input.Search
            value={searchForm.keyword}
            onChange={(e) => {
              setSearchForm((state) => ({
                ...state,
                keyword: e.target.value.trim(),
              }));
            }}
            allowClear
            style={{'{{'}} width: 400 {{'}}'}}
            placeholder="请输入{{cname}}名称搜索"
            enterButton={<>搜索</>}
            onSearch={() => {
              tableRef.current?.setPageInfo?.({ current: 1 });
              tableRef.current?.reload();
            }}
          />
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              // history.push('/_____/create');
              formModal.form.resetFields();
              formModal.formModalShow();
            }}
          >
            新增
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}{{cname}}`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{'{{'}}
          loading: formModal.submitLoading,
        {{'}}'}}
      >
        <br />
        <Form form={formModal.form} labelCol={{'{{'}} span: 4 {{'}}'}} initialValues={{'{{'}} redundancy_count: 1 {{'}}'}}>
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item label="ID" name="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="封面"
            name="cover"
            rules={[{ required: true, message: '请上传封面' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
          <RecommendFormItem />
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
