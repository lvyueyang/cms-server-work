import { enumMapToOptions, enumMapToTableEnum, transformPagination, transformSort } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Popconfirm, Select, Space } from 'antd';
import { useRef } from 'react';
import {
  getTranslationListApi,
  ContentTranslationItem,
  batchUpsertTranslationsApi,
  removeApi,
  updateApi,
  exportApi,
} from './module';
import PageTable from '@/components/PageTable';
import { openImportJsonModal } from '@/components/ImportData';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import { ContentTranslationUpdateDto } from '@cms/api-interface';
import { ContentType, ContentTypeMap } from '@/constants';
import { AutoContentInput } from '@/components/AutoContentInput';
import { ExportButton } from '@/components/ExportButton';
import { ContentLang, ContentLangMap } from '@cms/server/const';

type TableItem = ContentTranslationItem;
type FormValues = ContentTranslationUpdateDto & { valueType: ContentType };

export default function ContentTranslationPage() {
  const tableRef = useRef<ActionType>();
  const formModal = useFormModal<FormValues>({
    submit: (values, modal) => {
      return updateApi(values as ContentTranslationUpdateDto).then(() => {
        tableRef.current?.reload();
      });
    },
  });
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 50,
      hideInSearch: true,
    },
    {
      dataIndex: 'entity',
      title: '实体',
      width: 140,
      sorter: true,
    },
    {
      dataIndex: 'entityId',
      title: '实体ID',
      width: 100,
      hideInSearch: true,
    },
    {
      dataIndex: 'field',
      title: '字段',
      width: 140,
      sorter: true,
    },
    {
      dataIndex: 'lang',
      title: '语言',
      sorter: true,
      width: 90,
      filters: true,
      hideInSearch: true,
      valueEnum: enumMapToTableEnum(ContentLangMap),
    },
    {
      dataIndex: 'value',
      title: '翻译值',
      ellipsis: true,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      width: 100,
      render: (_, row) => {
        return (
          <Space>
            <a
              onClick={() => {
                formModal.form.setFieldsValue(row);
                formModal.formModalShow(ModalType.UPDATE);
              }}
            >
              修改
            </a>
            <Popconfirm
              title="确定要删除这个咨询吗？"
              onConfirm={() => {
                const close = message.loading('删除中...', 0);
                removeApi(row.id!)
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
  const handleImportSubmit = async (jsonValue: string) => {
    try {
      const translations = JSON.parse(jsonValue);
      if (!Array.isArray(translations)) {
        message.error('JSON数据必须是数组格式');
        throw new Error('JSON数据必须是数组格式');
      }

      // 验证数据格式
      for (const item of translations) {
        if (!item.entity || !item.entityId || !item.field || !item.lang) {
          message.error('翻译数据缺少必要字段');
          throw new Error('翻译数据缺少必要字段');
        }
      }
      await batchUpsertTranslationsApi({ translations });
      tableRef.current?.reload();
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error('JSON格式错误，请检查输入');
      } else {
        message.error('导入失败：' + (error as Error).message);
      }
      throw error;
    }
  };

  return (
    <>
      <PageTable<TableItem>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        form={{
          labelWidth: 'auto',
          span: 4,
        }}
        search={{}}
        toolBarRender={() => [
          <ExportButton exportFn={exportApi} key="export" />,
          <Button
            type="primary"
            key="import"
            onClick={() => {
              openImportJsonModal({
                onOk: async (value) => {
                  await handleImportSubmit(value);
                },
                help: (
                  <>
                    <strong>数据格式说明：</strong>
                    <div>• entity: 实体名（如 news, product）</div>
                    <div>• entityId: 实体记录ID</div>
                    <div>• field: 字段名（如 title, content）</div>
                    <div>• lang: 语言代码（如 en-US, zh-CN）</div>
                    <div>• value: 翻译值</div>
                  </>
                ),
              });
            }}
          >
            批量导入
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          return getTranslationListApi({
            ...transformPagination(params),
            ...transformSort(sorter),
            entity: params.entity,
            lang: filter.lang as ContentLang[],
            field: params.field,
            value: params.value,
          }).then((response) => {
            return {
              data: response.data?.data?.list || [],
              total: response.data?.data?.total || 0,
            };
          });
        }}
        pagination={{
          showSizeChanger: true,
        }}
      />

      <Modal
        maskClosable={false}
        open={formModal.formModal.open}
        title={`${formModal.formModalTitle}广告`}
        onCancel={formModal.formModalClose}
        onOk={formModal.submitHandler}
        okButtonProps={{
          loading: formModal.submitLoading,
        }}
        width={900}
        destroyOnHidden
      >
        <br />
        <Form form={formModal.form} labelCol={{ flex: '70px' }} initialValues={{}}>
          <Form.Item label="ID" name="id">
            <Input readOnly style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="实体" name="entity">
            <Input readOnly style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="实体ID" name="entityId">
            <Input readOnly style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="字段" name="field">
            <Input readOnly style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="语言" name="lang">
            <Input readOnly style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="编辑方式" name="valueType">
            <Select options={enumMapToOptions(ContentTypeMap)} style={{ width: '120px' }} />
          </Form.Item>
          <Form.Item label="内容" dependencies={['valueType']}>
            {() => {
              const type = formModal.form.getFieldValue('valueType');
              return (
                <Form.Item noStyle name="value">
                  <AutoContentInput type={type} />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
