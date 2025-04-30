import { message } from '@/utils/notice';
import { ActionType } from '@ant-design/pro-components';
import { Popconfirm, Switch } from 'antd';

interface AvailableSwitchProps {
  value: boolean;
  request: () => Promise<any>;
  tableRef?: React.MutableRefObject<ActionType | undefined>;
}

export function AvailableSwitch({ value, tableRef, request }: AvailableSwitchProps) {
  return (
    <Popconfirm
      title={`是否 ${value ? '下架' : '上架'} ?`}
      onConfirm={() => {
        request().then(() => {
          message.success('操作成功');
          tableRef?.current?.reload();
        });
      }}
    >
      <Switch checked={value} checkedChildren="上架" unCheckedChildren="下架" />
    </Popconfirm>
  );
}
