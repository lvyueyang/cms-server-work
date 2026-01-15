import { UserClient } from '@cms/api-interface';
import { transformPagination } from '@/utils';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef } from 'react';
import { getUserList } from './module';
import PageTable from '@/components/PageTable';

type TableItem = UserClient;

export default function UserClientList() {
  const tableRef = useRef<ActionType>();
  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'username',
      title: '用户名',
      width: 160,
    },
    {
      dataIndex: 'cname',
      title: '姓名',
      width: 160,
    },
    {
      dataIndex: 'email',
      title: '邮箱',
      width: 180,
    },
    {
      dataIndex: 'phone',
      title: '手机',
      width: 120,
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      width: 180,
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
    },
  ];

  return (
    <>
      <PageTable<TableItem>
        columns={columns}
        rowKey="id"
        bordered
        search={false}
        request={(params) => {
          return getUserList(transformPagination(params)).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        toolBarRender={() => []}
      />
    </>
  );
}
