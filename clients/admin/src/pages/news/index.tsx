import { NewsInfo } from '@cms/api-interface';
import { createI18nColumn, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { Link, history } from 'umi';
import { exportApi, getListApi, removeApi, updateApi } from './module';
import { AvailableSwitch } from '@/components/Available';
import PageTable from '@/components/PageTable';
import { ContentType } from '@/constants';
import { ExportButton } from '@/components/ExportButton';
import { TableColumnSort } from '@/components/TableColumnSort';

type TableItem = NewsInfo;
const i18nColumn = createI18nColumn<TableItem>('news');

export default function NewsPage() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
  });
  const tableRef = useRef<ActionType>();
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'cover',
      title: '缩略图',
      width: 60,
      valueType: 'image',
    },
    i18nColumn({
      dataIndex: 'title',
      title: '新闻名称',
      width: 160,
      sorter: true,
    }),
    {
      dataIndex: 'recommend',
      title: '推荐等级',
      width: 100,
      sorter: true,
      render: (_, row) => {
        return (
          <TableColumnSort
            value={row.recommend}
            request={(value) =>
              updateApi({
                id: row.id,
                recommend: value,
              })
            }
          />
        );
      },
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
      dataIndex: 'push_date',
      title: '发布日期',
      valueType: 'dateTime',
      sorter: true,
      width: 180,
    },
    i18nColumn({
      dataIndex: 'desc',
      title: '新闻描述',
      ellipsis: true,
      width: 200,
    }),
    i18nColumn({
      dataIndex: 'content',
      title: '内容',
      width: 50,
      ellipsis: true,
      transType: ContentType.LowCode,
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
      width: 180,
      sorter: true,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
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
      <PageTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        scroll={{ x: 1100 }}
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
            style={{ width: 400 }}
            placeholder="请输入新闻名称搜索"
            enterButton={<>搜索</>}
            allowClear
            onSearch={() => {
              tableRef.current?.setPageInfo?.({ current: 1 });
              tableRef.current?.reload();
            }}
          />
        }
        toolBarRender={() => [
          <ExportButton exportFn={exportApi} key="export" />,
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
    </>
  );
}
