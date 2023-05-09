import Header from '@/components/Header';
import PageContainer from '@/components/PageContainer';

import { NewsInfo } from '@/interface/serverApi';

import { transformPagination } from '@/utils';

import { message } from '@/utils/message';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';

import { Button, Input, Popconfirm, Space } from 'antd';

import { useRef, useState } from 'react';

import { Link, history } from 'umi';

import { getListApi, removeApi } from './module';

type TableItem = NewsInfo;

export default function NewsListPage() {
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
      title: '新闻名称',
    },
    {
      dataIndex: 'desc',
      title: '新闻描述',
      width: 300,
      ellipsis: true,
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      width: 160,
      render: (_, row) => {
        return (
          <Space>
            <Link to={`/news/update/${row.id}`}>编辑</Link>
            <Popconfirm
              title="确定要删除这个新闻吗？"
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
      <Header />
      <PageContainer>
        <ProTable<TableItem>
          columns={columns}
          rowKey="id"
          bordered
          search={false}
          request={(params) => {
            return getListApi({ ...transformPagination(params), ...searchForm }).then(
              ({ data }) => {
                return { data: data.data.list, total: data.data.total || 0 };
              },
            );
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
              placeholder="请输入新闻名称搜索"
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
                history.push('/news/create');
              }}
            >
              新增新闻
            </Button>,
          ]}
        />
      </PageContainer>
    </>
  );
}
