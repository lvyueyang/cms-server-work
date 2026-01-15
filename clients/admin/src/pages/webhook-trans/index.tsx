import { AvailableSwitch } from '@/components/Available';
import { WebhookTransInfo } from '@cms/api-interface';
import { copyText, transformPagination } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Drawer, Flex, Select, Modal, Divider } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import CodeEditor from '@/components/CodeEditor';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { message } from '@/utils/notice';
import PageTable from '@/components/PageTable';

type TableItem = WebhookTransInfo;
type FormValues = WebhookTransInfo & { id?: number };

export default function WebhookTransListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const formModal = useFormModal<FormValues>({
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
  const [infoModal, setInfoModal] = useState({
    open: false,
    data: {} as TableItem,
    testData: '',
  });
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'code',
      title: '编码',
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'desc',
      title: '描述',
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'method',
      title: '方法',
      width: 90,
    },
    {
      dataIndex: 'url',
      title: 'URL',
      width: 300,
      ellipsis: true,
    },
    {
      dataIndex: 'is_available',
      title: '是否可用',
      width: 90,
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
      width: 160,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      width: 160,
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
            <a
              onClick={() => {
                setInfoModal({
                  open: true,
                  data: row,
                  testData: `{"data": "123"}`,
                });
              }}
            >
              查看
            </a>
            <Popconfirm
              title="确定要删除这个Webhook中转吗？"
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
  const sendUrl = `${location.origin}/api/webhook_trans/send?key=${infoModal.data.code}`;

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
            placeholder="请输入Webhook中转名称搜索"
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
            新增Webhook中转
          </Button>,
        ]}
      />
      <Drawer
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}Webhook中转`}
        onClose={formModal.formModalClose}
        width={700}
        footer={
          <Flex justify="flex-end" gap={12}>
            <Button key="cancel" onClick={formModal.formModalClose}>
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={formModal.submitLoading}
              onClick={formModal.submitHandler}
            >
              提交
            </Button>
          </Flex>
        }
      >
        <br />
        <Form<FormValues>
          form={formModal.form}
          initialValues={{
            method: 'POST',
            code: uuid(),
            before_hook_func: `function main(data) {
  return true;
};`,
            data_trans_func: `function main(data) {
  return data;
};`,
            callback_func: `function main(data) {
  return {};
};`,
          }}
          layout="vertical"
        >
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item name="id" hidden>
              <Input disabled={formModal.formModal.type === ModalType.UPDATE} />
            </Form.Item>
          )}
          <Form.Item label="唯一编码 Key" name="code" rules={[{ required: true }]}>
            <Input
              readOnly
              // addonAfter={
              //   <a
              //     onClick={() => {
              //       formModal.form.setFieldValue('code', uuid());
              //     }}
              //   >
              //     更新
              //   </a>
              // }
            />
          </Form.Item>
          <Form.Item label="请求地址" name="url">
            <Input />
          </Form.Item>
          <Form.Item label="请求方法" name="method">
            <Select
              options={[
                { label: 'POST', value: 'POST' },
                { label: 'GET', value: 'GET' },
                { label: 'PUT', value: 'PUT' },
              ]}
            />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="前置Hook函数"
            name="before_hook_func"
            tooltip="返回false时，将中断后续处理"
          >
            <CodeEditor style={{ height: 260 }} />
          </Form.Item>
          <Form.Item label="数据转换函数" name="data_trans_func" tooltip="返回转换后的数据">
            <CodeEditor style={{ height: 260 }} />
          </Form.Item>
          <Form.Item label="回调响应转换函数" name="callback_func" tooltip="返回转换后的数据">
            <CodeEditor style={{ height: 260 }} />
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        open={infoModal.open}
        title="Webhook中转详情"
        width={900}
        footer={false}
        onCancel={() => {
          setInfoModal({
            open: false,
            data: {} as TableItem,
            testData: '',
          });
        }}
        onOk={() => {
          setInfoModal({
            open: false,
            data: {} as TableItem,
            testData: '',
          });
        }}
      >
        <div>
          <Divider>请求地址</Divider>
          <Space>
            <span>{sendUrl}</span>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                copyText(sendUrl).then(() => {
                  message.success('复制成功');
                });
              }}
            >
              复制
            </Button>
          </Space>
          <br />
          <br />
          <Divider>
            <Button
              type="primary"
              onClick={() => {
                const msgClose = message.loading('发送中...');
                axios
                  .post(sendUrl, JSON.parse(infoModal.testData))
                  .then(() => {
                    message.success('已发送');
                  })
                  .catch(() => {
                    message.error('发送失败');
                  })
                  .finally(() => {
                    msgClose();
                  });
              }}
            >
              测试
            </Button>
          </Divider>
          <CodeEditor
            style={{ height: 260 }}
            value={infoModal.testData}
            onChange={(e) => {
              setInfoModal({
                ...infoModal,
                testData: e,
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
}
