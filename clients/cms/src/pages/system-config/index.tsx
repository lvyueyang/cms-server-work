import { AvailableSwitch } from '@/components/Available';
import { SystemConfigCreateDto, SystemConfigInfo, SystemConfigUpdateDto } from '@cms/api-interface';
import { createI18nColumn, enumMapToOptions, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch, Select } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import PageTable from '@/components/PageTable';
import { ContentTypeMap } from '@/constants';
import { AutoContentInput } from '@/components/AutoContentInput';

type TableItem = SystemConfigInfo;
type CreateFormValues = SystemConfigCreateDto;
type UpdateFormValues = SystemConfigUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('system_config');

export default function SystemConfigPage() {
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
      dataIndex: 'code',
      title: '编码',
      width: 120,
    },
    i18nColumn({
      dataIndex: 'title',
      title: '名称',
      sorter: true,
      width: 160,
    }),
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
      dataIndex: 'content_type',
      title: '内容类型',
      width: 100,
    },
    i18nColumn({
      dataIndex: 'content',
      title: '内容',
      width: 120,
      ellipsis: true,
      transType: 'rich',
    }),
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
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定要删除这个系统配置吗？"
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
            placeholder="请输入系统配置名称搜索"
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
        keyboard={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}系统配置`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
        width={800}
      >
        <br />
        <Form
          form={formModal.form}
          labelCol={{ span: 4 }}
          initialValues={{ redundancy_count: 1 }}
          onValuesChange={(e) => {
            console.log('e', e);
          }}
        >
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item label="ID" name="id" hidden>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="编码" name="code" rules={[{ required: true }]}>
            <Input
              style={{ width: 200 }}
              disabled={formModal.formModal.type !== ModalType.CREATE}
            />
          </Form.Item>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="内容类型" name="content_type">
            <Select options={enumMapToOptions(ContentTypeMap)} allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>

          <Form.Item label="内容" dependencies={['content_type']}>
            {() => {
              const contentType = formModal.form.getFieldValue('content_type');
              return (
                <Form.Item noStyle name="content">
                  <AutoContentInput type={contentType} />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
