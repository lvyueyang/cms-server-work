import { AvailableSwitch } from '@/components/Available';
import {
  PublicArticleCreateDto,
  PublicArticleInfo,
  PublicArticleUpdateDto,
} from '@cms/api-interface';
import { createI18nColumn, transformPagination, transformSort } from '@/utils';
import { message } from '@/utils/notice';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Space, Form, Modal, Switch } from 'antd';
import { useRef, useState } from 'react';
import { createApi, getListApi, removeApi, updateApi } from './module';
import { ModalType, useFormModal } from '@/hooks/useFormModal';
import UploadImage from '@/components/UploadImage';
import { RecommendFormItem } from '@/components/RecommendFormItem';
import PageTable from '@/components/PageTable';
import { history, Link } from 'umi';
import { ContentType, ContentTypeMap } from '@/constants';
import { TableColumnSort } from '@/components/TableColumnSort';

type TableItem = PublicArticleInfo;
type CreateFormValues = PublicArticleCreateDto;
type UpdateFormValues = PublicArticleUpdateDto;
type FormValues = CreateFormValues | UpdateFormValues;

const i18nColumn = createI18nColumn<TableItem>('public_article');

export default function PublicArticlePage() {
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
      title: '名称',
      sorter: true,
      width: 160,
    }),
    {
      dataIndex: 'recommend',
      title: '推荐等级',
      sorter: true,
      width: 100,
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
      width: 100,
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
    i18nColumn({
      dataIndex: 'desc',
      title: '描述',
      width: 180,
      ellipsis: true,
    }),
    {
      dataIndex: 'content_type',
      title: '内容类型',
      width: 70,
      render: (_, row) => {
        return ContentTypeMap.get(row.content_type as ContentType)?.label || '-';
      },
    },
    i18nColumn({
      dataIndex: 'content',
      title: '内容',
      width: 40,
      ellipsis: true,
      transType: ContentType.Rich,
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
      sorter: true,
      width: 180,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      render: (_, row) => {
        return (
          <Space>
            <Link to={`/public-article/update/${row.id}`}>编辑</Link>
            <Popconfirm
              title="确定要删除这个开放文章吗？"
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
        scroll={{ x: 1460 }}
        search={false}
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
            allowClear
            style={{ width: 400 }}
            placeholder="请输入开放文章名称搜索"
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
              history.push('/public-article/create');
            }}
          >
            新增
          </Button>,
        ]}
      />
    </>
  );
}
