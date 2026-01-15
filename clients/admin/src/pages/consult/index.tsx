import { AvailableSwitch } from '@/components/Available';
import { ConsultCreateDto, ConsultInfo, ConsultUpdateDto } from '@cms/api-interface';
import { createI18nColumn, transformPagination, transformSort } from '@/utils';
import { message, modal } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch, Tag, Flex } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadImage from '@/components/UploadImage';
import { RecommendFormItem } from '@/components/RecommendFormItem';
import PageTable from '@/components/PageTable';

type TableItem = ConsultInfo;
type CreateFormValues = ConsultCreateDto;
type UpdateFormValues = ConsultUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('consult');

export default function ConsultPage() {
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
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'name',
      title: '姓名',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'email',
      title: '邮箱',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'ip',
      title: 'IP',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      sorter: true,
      width: 120,
    },
    {
      dataIndex: 'content',
      title: '留言',
      sorter: true,
      ellipsis: true,
      width: 360,
    },
    {
      dataIndex: 'is_available',
      title: '是否已解决',
      width: 100,
      render: (_, row) => {
        return (
          <AvailableSwitch
            value={row.is_processed}
            tableRef={tableRef}
            checkedChildren="已解决"
            unCheckedChildren="未解决"
            request={() =>
              updateApi({
                id: row.id,
                is_processed: !row.is_processed,
              })
            }
          />
        );
      },
    },
    {
      dataIndex: 'desc',
      title: '备注',
      width: 200,
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
      fixed: 'right',
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                let desc = '';
                const m = modal.info({
                  title: '备注',
                  cancelText: '取消',
                  okText: '确认',
                  icon: null,
                  footer: (
                    <Flex justify="flex-end" gap={8} style={{ marginTop: 12 }}>
                      <Button onClick={() => m?.destroy?.()}>取消</Button>
                      <Button
                        onClick={() => {
                          updateApi({
                            id: row.id,
                            desc,
                          }).then(() => {
                            tableRef.current?.reload();
                            m.destroy();
                          });
                        }}
                        type="primary"
                      >
                        确认
                      </Button>
                    </Flex>
                  ),
                  content: (
                    <Input.TextArea
                      defaultValue={row.desc}
                      onChange={(e) => {
                        desc = e.target.value;
                      }}
                    />
                  ),
                });
              }}
            >
              添加备注
            </a>
            <Popconfirm
              title="确定要删除这个咨询吗？"
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
      <PageTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        scroll={{ x: 1400 }}
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
            style={{ width: 400 }}
            placeholder="请输入咨询名称搜索"
            enterButton={<>搜索</>}
            onSearch={() => {
              tableRef.current?.setPageInfo?.({ current: 1 });
              tableRef.current?.reload();
            }}
          />
        }
        toolBarRender={() => [
          // <Button
          //   key="create"
          //   type="primary"
          //   onClick={() => {
          //     // history.push('/_____/create');
          //     formModal.form.resetFields();
          //     formModal.formModalShow();
          //   }}
          // >
          //   新增
          // </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}咨询`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
      >
        <br />
        <Form form={formModal.form} labelCol={{ span: 4 }} initialValues={{ redundancy_count: 1 }}>
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item label="ID" name="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="封面" name="cover" rules={[{ required: true, message: '请上传封面' }]}>
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
