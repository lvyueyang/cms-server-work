import { transformPagination, transformSort } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import {
  getTranslationListApi,
  ContentTranslationItem,
  batchUpsertTranslationsApi,
} from './module';
import PageTable from '@/components/PageTable';
import { openImportJsonModal } from '@/components/ImportData';

export default function ContentTranslationPage() {
  const [importModalVisible, setImportModalVisible] = useState(false);
  const tableRef = useRef<ActionType>();
  const columns: ProColumns<ContentTranslationItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 80,
      hideInSearch: true,
    },
    {
      dataIndex: 'entity',
      title: '实体',
      width: 220,
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
      width: 100,
    },
    {
      dataIndex: 'value',
      title: '翻译值',
      ellipsis: true,
      hideInSearch: true,
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
          console.log(item);
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
  const handleImportSuccess = () => {
    tableRef.current?.reload();
  };

  return (
    <>
      <PageTable<ContentTranslationItem>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        form={{
          labelWidth: 'auto',
          span: 5,
        }}
        search={{}}
        toolBarRender={() => [
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
        request={async (params, sorter) => {
          return getTranslationListApi({
            ...transformPagination(params),
            ...transformSort(sorter),
            entity: params.entity,
            lang: params.lang,
            field: params.field,
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
    </>
  );
}
