import Header from '@/components/Header';
import PageContainer from '@/components/PageContainer';
import { {{entityName}}Info } from '@/interface/serverApi';
import { transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/message';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { history, Link } from 'umi';
import { getListApi, removeApi } from './module';

type TableItem = {{entityName}}Info;

export default function {{entityName}}ListPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();

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
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      sorter: true,
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
          request={(params, sorter) => {
            return getListApi({
              ...transformPagination(params),
              ...transformSort(sorter),
              ...searchForm,
            }).then(({ data }) => {
              return { data: data.data.list, total: data.data.total || 0 };
            });
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
              {{ '}}' }}
            >
              新增{{cname}}
            </Button>,
          ]}
        />
      </PageContainer>
    </>
  );
}
