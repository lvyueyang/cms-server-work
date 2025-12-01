import { AvailableSwitch } from '@/components/Available';
import { DictValueCreateDto, DictValueInfo, DictValueUpdateDto } from '@cms/api-interface';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch, InputNumber, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams, history } from 'umi';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import { useDictStore } from '@/store/dict';
import { createI18nColumn } from '@/utils';

type TableItem = DictValueInfo;
type CreateFormValues = DictValueCreateDto;
type UpdateFormValues = DictValueUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('dict_value');

export default function DictValueListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const params = useParams();
  const tableRef = useRef<ActionType>();
  const dictStore = useDictStore();
  const formModal = useFormModal<FormValues>({
    submit: (values, modal) => {
      if (modal.type === ModalType.UPDATE) {
        return updateApi(values as DictValueUpdateDto).then(() => {
          tableRef.current?.reload();
          dictStore.load();
        });
      }
      return createApi({
        ...values,
        typeId: Number(params.id),
      } as DictValueCreateDto).then(() => {
        tableRef.current?.reload();
        dictStore.load();
      });
    },
  });
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 70,
    },
    {
      dataIndex: 'recommend',
      title: '排序',
      sorter: (a, b) => a.recommend - b.recommend,
      width: 80,
    },
    i18nColumn({
      dataIndex: 'label',
      title: '名称',
      width: 140,
    }),
    {
      dataIndex: 'value',
      title: '值',
      width: 180,
    },
    i18nColumn({
      dataIndex: 'desc',
      title: '描述',
      ellipsis: true,
      width: 180,
    }),
    {
      dataIndex: 'attr',
      title: '属性',
      ellipsis: true,
      width: 180,
    },
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
      valueType: 'dateTime',
      width: 170,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      width: 170,
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
              title="确定要删除这个字典值吗？"
              onConfirm={() => {
                const close = message.loading('删除中...', 0);
                removeApi(row.id)
                  .then(() => {
                    message.success('删除成功');
                    tableRef.current?.reload();
                    dictStore.load();
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
      history.replace(`/dict/${type}`);
      if (type) {
        formModal.form.resetFields();
        formModal.formModalShow();
      }
    }
  }, []);

  return (
    <>
      <ProTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        scroll={{ x: 1200 }}
        search={false}
        pagination={false}
        request={() => {
          return getListApi({ ...searchForm, typeId: Number(params.id) }).then(({ data }) => {
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
            placeholder="请输入字典值名称搜索"
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
            新增字典值
          </Button>,
        ]}
      />
      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}字典值`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
      >
        <br />
        <Form
          form={formModal.form}
          labelCol={{ span: 4 }}
          initialValues={{ recommend: 0, is_available: true }}
        >
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item label="名称" name="label" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="值" name="value" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="排序" name="recommend">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="上架状态" name="is_available" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>

          <Form.Item label="附加属性" name="attr">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
