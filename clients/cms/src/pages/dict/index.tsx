import { AvailableSwitch } from '@/components/Available';
import { DictTypeCreateDto, DictTypeInfo, DictTypeUpdateDto } from '@cms/api-interface';
import { createI18nColumn, transformPagination } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import { Link, history } from 'umi';
import { useDictStore } from '@/store/dict';
import PageTable from '@/components/PageTable';

type TableItem = DictTypeInfo;
type CreateFormValues = DictTypeCreateDto;
type UpdateFormValues = DictTypeUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('dict_type');

export default function DictTypeListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const dictStore = useDictStore();
  const formModal = useFormModal<FormValues>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE) {
        return updateApi(values as DictTypeUpdateDto).then(() => {
          tableRef.current?.reload();
          dictStore.load();
        });
      }
      return createApi(values as DictTypeCreateDto).then(() => {
        tableRef.current?.reload();
        dictStore.load();
      });
    },
  });
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    i18nColumn({
      dataIndex: 'name',
      title: '名称',
      width: 160,
    }),
    {
      dataIndex: 'type',
      title: '类型',
      width: 160,
      render: (_, row) => {
        return <Link to={`/dict/${row.id}`}>{row.type}</Link>;
      },
    },
    i18nColumn({
      dataIndex: 'desc',
      title: '描述',
      width: 220,
      ellipsis: true,
    }),
    {
      dataIndex: 'is_available',
      title: '是否可用',
      width: 80,
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
      dataIndex: 'create_date',
      title: '创建时间',
      width: 175,
      valueType: 'dateTime',
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      width: 175,
      valueType: 'dateTime',
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
              title="确定要删除这个字典类型吗？"
              onConfirm={() => {
                const close = message.loading('删除中...', 0);
                removeApi(row.id)
                  .then(() => {
                    dictStore.load();
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

  useEffect(() => {
    const historyState = history.location.state;
    if (historyState) {
      const { type } = historyState as Record<string, any>;
      history.replace('/dict');
      if (type) {
        formModal.form.resetFields();
        formModal.form.setFieldValue('type', type);
        formModal.formModalShow();
      }
    }
  }, []);

  return (
    <>
      <PageTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        request={(params) => {
          return getListApi({ ...transformPagination(params), ...searchForm }).then(({ data }) => {
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
            style={{ width: 400 }}
            placeholder="请输入字典类型名称搜索"
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
              formModal.form.resetFields();
              formModal.formModalShow();
            }}
          >
            新增字典类型
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}字典类型`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
      >
        <br />
        <Form form={formModal.form} labelCol={{ span: 4 }} initialValues={{ redundancy_count: 1 }}>
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
