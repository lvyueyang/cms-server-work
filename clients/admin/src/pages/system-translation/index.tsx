import {
  SystemTranslationCreateDto,
  SystemTranslationInfo,
  SystemTranslationUpdateDto,
} from '@cms/api-interface';
import { createI18nColumn, enumMapToOptions, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Form,
  Modal,
  Switch,
  Tag,
  Select,
  Typography,
} from 'antd';
import { useRef, useState } from 'react';
import { createApi, createMultiApi, exportApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadImage from '@/components/UploadImage';
import { RecommendFormItem } from '@/components/RecommendFormItem';
import PageTable from '@/components/PageTable';
import { ContentLang, ContentLangMap } from '@cms/server/const';
import { openImportJsonModal } from '@/components/ImportData';
import { ContentType, ContentTypeMap } from '@/constants';
import { AutoContentInput } from '@/components/AutoContentInput';
import { ExportButton } from '@/components/ExportButton';

type TableItem = SystemTranslationInfo;
type CreateFormValues = SystemTranslationCreateDto;
type UpdateFormValues = SystemTranslationUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('system_translation');

export default function SystemTranslationPage() {
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
      dataIndex: 'lang',
      title: '语言',
      width: 150,
      search: true,
      valueEnum: {
        [ContentLang.ZH_CN]: '中文',
        [ContentLang.EN_US]: '英文',
      },
      render: (_, row) => {
        // return row.lang;
        return (
          <Space>
            {ContentLangMap.get(row.lang as any)?.label}
            <Tag>{row.lang}</Tag>
          </Space>
        );
      },
    },
    {
      dataIndex: 'key',
      title: '键名',
      width: 200,
      search: true,
    },
    {
      dataIndex: 'value_type',
      title: '值类型',
      width: 100,
      search: false,
      render: (_, row) => {
        return row.value_type || 'string';
      },
    },
    {
      dataIndex: 'value',
      title: '值',
      width: 200,
      ellipsis: true,
      search: true,
    },
    {
      dataIndex: 'desc',
      title: '国际化描述',
      width: 140,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch: true,
      search: true,
      width: 180,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      hideInSearch: true,
      search: true,
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
              title="确定要删除这个国际化吗？"
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
        search={{
          labelWidth: 'auto',
          span: 5,
        }}
        request={(params, sorter) => {
          return getListApi({
            ...transformPagination(params),
            ...transformSort(sorter),
            key: params.key,
            lang: params.lang,
            value: params.value,
          }).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        toolBarRender={() => [
          <ExportButton exportFn={exportApi} key="export" />,
          <Button
            key="import"
            onClick={() => {
              openImportJsonModal({
                onOk: async (jsonValue) => {
                  const translations = JSON.parse(jsonValue);
                  if (!Array.isArray(translations)) {
                    message.error('JSON数据必须是数组格式');
                    throw new Error('JSON数据必须是数组格式');
                  }
                  // 验证数据格式
                  for (const item of translations) {
                    if (!item.key || !item.lang || !item.value) {
                      console.log(item);
                      message.error('翻译数据缺少必要字段');
                      throw new Error('翻译数据缺少必要字段');
                    }
                  }
                  await createMultiApi({ list: translations });
                  tableRef.current?.reload();
                },
                help: (
                  <Typography>
                    <h5>示例</h5>
                    <pre>
                      <Typography.Text code>
                        {`[
  {
    "key": "新闻",
    "lang": "en-US",
    "value": "news"
  },
  {
    "key": "新闻1",
    "lang": "en-US",
    "value": "news"
  }
]`}
                      </Typography.Text>
                    </pre>
                    <h5>字段说明</h5>
                    <ul>
                      <li>
                        <code>key</code>：国际化键名，用于唯一标识一个翻译项。
                      </li>
                      <li>
                        <code>lang</code>：语言代码，例如 <code>en-US</code> 表示英文。
                      </li>
                      <li>
                        <code>value</code>：翻译值，即对应语言的文本内容。
                      </li>
                    </ul>
                  </Typography>
                ),
              });
            }}
          >
            批量导入
          </Button>,
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
        title={`${formModal.formModalTitle}国际化`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
        width={900}
      >
        <br />
        <Form
          form={formModal.form}
          labelCol={{ span: 4 }}
          initialValues={{ lang: ContentLang.EN_US, value_type: ContentType.TEXT }}
        >
          {formModal.formModal.type !== ModalType.CREATE && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item label="语言" name="lang" rules={[{ required: true }]}>
            <Select
              disabled={formModal.formModal.type === ModalType.UPDATE}
              options={[
                {
                  label: '英文',
                  value: ContentLang.EN_US,
                },
                {
                  label: '中文',
                  value: ContentLang.ZH_CN,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Key" name="key" rules={[{ required: true }]}>
            <Input disabled={formModal.formModal.type === ModalType.UPDATE} />
          </Form.Item>
          <Form.Item label="值类型" name="value_type">
            <Select options={enumMapToOptions(ContentTypeMap)} allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="翻译值" dependencies={['value_type']}>
            {() => {
              const valueType = formModal.form.getFieldValue('value_type');
              return (
                <Form.Item noStyle name="value">
                  <AutoContentInput type={valueType} />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
