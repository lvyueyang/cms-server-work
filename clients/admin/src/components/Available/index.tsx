import { ActionType } from '@ant-design/pro-components';
import { Popconfirm, Switch } from 'antd';
import { ReactNode } from 'react';
import { message } from '@/utils/notice';

interface AvailableSwitchProps {
  value: boolean;
  request: () => Promise<any>;
  tableRef?: React.MutableRefObject<ActionType | undefined>;
  checkedChildren?: string;
  unCheckedChildren?: string;
  title?: (isChecked: boolean) => ReactNode;
}

export function AvailableSwitch({
  value,
  tableRef,
  request,
  checkedChildren = '上架',
  unCheckedChildren = '下架',
  title,
}: AvailableSwitchProps) {
  return (
    <Popconfirm
      title={title ? title(value) : `是否 ${value ? unCheckedChildren : checkedChildren} ?`}
      onConfirm={() => {
        request().then(() => {
          message.success('操作成功');
          tableRef?.current?.reload();
        });
      }}
    >
      <Switch
        checked={value}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
    </Popconfirm>
  );
}
