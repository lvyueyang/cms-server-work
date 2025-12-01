import { transformPagination, transformSort } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { getTranslationListApi, ContentTranslationItem } from './module';
import { BatchImportModal } from './components';
import PageTable from '@/components/PageTable';

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
  const handleImport = () => {
    setImportModalVisible(true);
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
          <Button type="primary" key="import" onClick={handleImport}>
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
      <BatchImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />
    </>
  );
}
