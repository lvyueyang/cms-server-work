import type { SelectProps } from 'antd';
import { Select, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useRef, useState } from 'react';
import { getListApi } from '.';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<DefaultOptionType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<ValueType = any>({
  fetchOptions,
  debounceTimeout = 500,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const timerRef = useRef<any>();

  const searchHandler = (value: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchOptions(value).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    }, debounceTimeout);
  };

  useEffect(() => {
    searchHandler('');
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={searchHandler}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
      onChange={(e) => {
        // @ts-ignore
        props.onChange(e.map((a) => a.value));
      }}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

async function fetchList(cname: string): Promise<UserValue[]> {
  return getListApi({ current: 1, page_size: 100 }).then((res) =>
    res.data.data.list.map((d) => {
      return {
        label: `${d.name}-${d.cname}-${d.type}`,
        value: d.name,
        data: d,
      };
    }),
  );
}

export const PropertiesSelect: React.FC<{
  value?: string[];
  onChange?: (value: string[]) => void;
}> = ({ value, onChange }) => {
  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="选择属性"
      fetchOptions={fetchList}
      onChange={(newValue) => {
        onChange?.(newValue as string[]);
      }}
      style={{ width: '100%' }}
    />
  );
};
