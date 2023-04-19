import {
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  Popconfirm,
  PopconfirmProps,
} from 'antd';
import { useEffect, useState } from 'react';

interface EditPopoverProps extends Omit<PopconfirmProps, 'onConfirm'> {
  value?: string;
  onConfirm?: (value: string | number) => void;
  inputStyle?: React.CSSProperties;
  inputType?: 'number' | 'text';
  inputProps?: InputProps;
  inputNumberProps?: InputNumberProps;
}

export default function EditPopover({
  value = '',
  inputStyle,
  inputType = 'text',
  inputProps,
  inputNumberProps,
  onConfirm,
  ...props
}: EditPopoverProps) {
  const [val, setVal] = useState(value);
  useEffect(() => {
    if (value && !val) {
      setVal(value);
    }
  }, [value]);
  return (
    <Popconfirm
      {...props}
      icon={false}
      description={
        <>
          {inputType === 'text' && (
            <Input
              {...inputProps}
              style={{ marginLeft: -14, ...inputStyle, ...inputProps?.style }}
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
              }}
            />
          )}
          {inputType === 'number' && (
            <InputNumber
              {...inputNumberProps}
              style={{ marginLeft: -14, ...inputStyle, ...inputNumberProps?.style }}
              value={val}
              onChange={(e) => {
                setVal(e?.toString() || '');
              }}
            />
          )}
        </>
      }
      onConfirm={() => {
        onConfirm?.(val);
      }}
    />
  );
}
