import { TrackEvent } from '@cms/api-interface';
import { transformPagination } from '@/utils';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { getListApi } from './module';
import { Descriptions, Select } from 'antd';
import { TrackEventSelect } from '../track-meta-event/module/Select';
import PageTable from '@/components/PageTable';

type TableItem = TrackEvent;

export default function TrackListPage() {
  const tableRef = useRef<ActionType>();
  const [propertiesKeyOptions, setPropertiesKeyOptions] = useState([]);

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'name',
      title: '事件名称',
      renderFormItem(schema, config) {
        return (
          <TrackEventSelect
            allowClear
            style={{ width: 200 }}
            onSelect={(value, option: any) => {
              setPropertiesKeyOptions(option?.data?.properties || []);
            }}
          />
        );
      },
    },
    {
      dataIndex: 'properties_key',
      title: '事件属性',
      hideInTable: true,
      renderFormItem() {
        return (
          <Select
            options={propertiesKeyOptions.map((o: any) => ({ label: o.cname, value: o.name }))}
            allowClear
            style={{ width: 200 }}
          />
        );
      },
    },
    {
      dataIndex: 'properties_value',
      title: '事件属性值',
      hideInTable: true,
    },
    {
      dataIndex: 'cname',
      title: '事件显示名称',
      search: false,
      render: (_, row) => row.metaEvent?.cname,
    },
    {
      dataIndex: 'user',
      title: '用户',
      search: false,
      render: (_, row) => {
        return row.userId;
      },
    },
    {
      dataIndex: 'create_date',
      title: '创建时间',
      valueType: 'dateTime',
      search: false,
    },
    {
      dataIndex: 'date_range',
      title: '时间',
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({ start_date: value[0], end_date: value[1] }),
      },
    },
    {
      dataIndex: 'update_date',
      title: '修改时间',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <PageTable<TableItem>
        columns={columns}
        request={(params) => {
          return getListApi({ ...params, ...transformPagination(params) }).then(({ data }) => {
            return { data: data.data.list, total: data.data.total || 0 };
          });
        }}
        actionRef={tableRef}
        expandable={{
          expandedRowRender: (row) => {
            return (
              <Descriptions layout="horizontal">
                {row.properties.map((item) => {
                  return (
                    <Descriptions.Item key={item.id} label={item.key}>
                      {item.value}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            );
          },
        }}
        search={{
          span: 4.5,
          labelWidth: 'auto',
        }}
      />
    </>
  );
}
