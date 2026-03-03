import { {{entityName}}Info } from '@cms/api-interface';
import { useRequest } from 'ahooks';
import { RefSelectProps, Select, SelectProps } from 'antd';
import { forwardRef } from 'react';
import { getListApi } from './services';

interface Opt {
  label: string;
  value: number;
  data: {{entityName}}Info;
}
export const {{entityName}}Select = forwardRef<
  RefSelectProps,
  SelectProps<Opt['value'], Opt> & {
    onSelect?: (v: Opt['value'], option?: Opt | Opt[]) => void;
  }
>((props, ref) => {
  const { data: options } = useRequest(() => {
    return getListApi({ current: 1, page_size: 100 }).then((res) =>
      res.data.data.list.map((d) => ({
        data: d,
        label: d.title,
        value: d.id,
      })),
    );
  });
  return (
    <Select<Opt['value'], Opt>
      {...props}
      ref={ref}
      options={options}
      onChange={(value, option) => {
        props.onChange?.(value, option);
        props.onSelect?.(value, option);
      }}
    />
  );
});
