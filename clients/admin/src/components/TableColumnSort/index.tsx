import { InputNumber } from 'antd';
import s from './index.module.scss';
import { useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { message } from '@/utils/notice';

interface TableColumnSortProps {
  value: number;
  request: (value: number) => Promise<unknown>;
}

export function TableColumnSort(props: TableColumnSortProps) {
  const [value, setValue] = useState(props.value);
  const { run } = useDebounceFn(
    (val: number) => props.request(val).then(() => message.success('已更新')),
    {
      wait: 700,
    },
  );
  return (
    <div className={s.container}>
      <div className={s.child}>{value}</div>
      <div className={s.control}>
        <InputNumber<number>
          value={value}
          size="small"
          onChange={(value) => {
            setValue(value || 0);
            run(value || 0);
          }}
        />
      </div>
    </div>
  );
}
