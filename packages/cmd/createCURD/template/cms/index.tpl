import Header from '@/components/Header';
import PageContainer from '@/components/PageContainer';
import { AvailableSwitch } from '@/components/Available';
import { {{entityName}}Info } from '@/interface/serverApi';
import { transformPagination } from '@/utils';
import { message } from '@/utils/message';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form } from 'antd';
import { useRef, useState } from 'react';
import { history, Link } from 'umi';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';

type TableItem = {{entityName}}Info;

export default function {{entityName}}ListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();

  const formModal = useFormModal<SiteColumnCreateDto & { id?: number }>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE && values.id) {
        return updateApi(values.id, values).then(() => {
          tableRef.current?.reload();
        });
      }
      return createApi(values).then(() => {
        tableRef.current?.reload();
      });
    },
  });

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'cover',
      title: '缩略图',
      valueType: 'image',
    },
    {
      dataIndex: 'title',
      title: '{{cname}}名称',
    },
    {
      dataIndex: 'desc',
      title: '{{cname}}描述',
      width: 300,
      ellipsis: true,
    },
    {
      dataIndex: 'is_available',
      title: '是否可用',
      render: (_, row) => {
        return (
          <AvailableSwitch
            value={row.is_available}
            tableRef={tableRef}
            request={() =>
              updateApi(row.id, {
                is_available: !row.is_available,
              })
            }
          />
        );
      },
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      width: 160,
      render: (_, row) => {
        return (
          <Space>
            <Link to={`/{{pathName}}/update/${row.id}`}>编辑</Link>
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
              onConfirm={{ '{() => {' | safe }}
                const close = message.loading('删除中...', 0);
                removeApi(row.id)
                  .then(() => {
                    message.success('删除成功');
                    tableRef.current?.reload();
                  })
                  .finally(() => {
                    close();
                  });
              {{ '}}' }}
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
      <Header />
      <PageContainer>
        <ProTable<TableItem>
          columns={columns}
          rowKey="id"
          bordered
          search={false}
          request={(params) => {
            return getListApi({ ...transformPagination(params), ...searchForm }).then(
              ({ data }) => {
                return { data: data.data.list, total: data.data.total || 0 };
              },
            );
          {{ '}}' }}
          actionRef={tableRef}
          headerTitle={
            <Input.Search
              value={searchForm.keyword}
              onChange={(e) => {
                setSearchForm((state) => ({
                  ...state,
                  keyword: e.target.value.trim(),
                }));
              {{ '}}' }}
              style={{ '{{' }} width: 400 {{ '}}' }}
              placeholder="请输入{{cname}}名称搜索"
              enterButton={<>搜索</>}
              onSearch={() => {
                tableRef.current?.setPageInfo?.({ current: 1 });
                tableRef.current?.reload();
              {{ '}}' }}
            />
          }
          toolBarRender={() => [
            <Button
              key="create"
              type="primary"
              onClick={() => {
                history.push('/{{pathName}}/create');
                formModal.form.resetFields();
                formModal.formModalShow();
              {{ '}}' }}
            >
              新增{{cname}}
            </Button>,
          ]}
        />
      </PageContainer>
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
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item label="{{cname}}标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="{{cname}}封面"
            name="cover"
            rules={[{ required: true, message: '请上传{{cname}}封面' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
          <Form.Item label="{{cname}}描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="{{cname}}详情"
            name="content"
            rules={[{ required: true, validateTrigger: 'submit' }]}
          >
            <Editor style={{ '{{' }} height: 400 {{ '}}' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
