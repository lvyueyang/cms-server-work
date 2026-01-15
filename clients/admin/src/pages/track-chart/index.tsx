import PageContainer from '@/components/PageContainer';
import { queryApi } from './module';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Dayjs } from 'dayjs';
import { Line } from '@ant-design/plots';
import { useState } from 'react';
import { ChartItem } from '@cms/api-interface';
import { TrackEventSelect } from '../track-meta-event/module/Select';

interface FormValues {
  name: string;
  dateRange: [Dayjs, Dayjs];
  properties_key?: string;
  properties_value?: string;
}

export default function TrackChartPage() {
  const [list, setList] = useState<ChartItem[]>([]);
  const [propertiesKeyOptions, setPropertiesKeyOptions] = useState([]);

  return (
    <>
      <Card size="small">
        <Form<FormValues>
          layout="inline"
          onFinish={(value) => {
            console.log(value);
            queryApi({
              name: value.name,
              start_date: value.dateRange[0].format('YYYY-MM-DD'),
              end_date: value.dateRange[1].format('YYYY-MM-DD'),
              properties_key: value.properties_key,
              properties_value: value.properties_value,
            }).then((res) => {
              setList(res.data.data || []);
            });
          }}
        >
          <FormItem label="事件名称" name="name" required>
            <TrackEventSelect
              style={{ width: 200 }}
              onSelect={(value, option: any) => {
                setPropertiesKeyOptions(option?.data?.properties || []);
              }}
            />
          </FormItem>
          {/* <FormItem label="事件属性" name="properties_key">
              <Select
                options={propertiesKeyOptions.map((o: any) => ({ label: o.cname, value: o.name }))}
                allowClear
                style={{ width: 200 }}
              />
            </FormItem>
            <FormItem label="事件属性值" name="properties_value">
              <Input style={{ width: 200 }} />
            </FormItem> */}
          <FormItem label="时间范围" name="dateRange" required>
            <DatePicker.RangePicker />
          </FormItem>
          <FormItem>
            <Button htmlType="submit">查询</Button>
          </FormItem>
        </Form>
      </Card>
      <Card size="small">
        <Line
          data={list}
          xField="date"
          yField="count"
          point={{
            shapeField: 'square',
            sizeField: 4,
          }}
          interaction={{
            tooltip: {
              marker: false,
            },
          }}
          style={{ lineWidth: 2 }}
        />
      </Card>
    </>
  );
}
