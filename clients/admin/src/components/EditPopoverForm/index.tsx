import { Form, Popconfirm, PopconfirmProps } from 'antd';

interface EditPopoverFormProps<T> extends Omit<PopconfirmProps, 'onConfirm'> {
  value?: T;
  label?: string;
  defaultValue?: T;
  onConfirm?: (value: T) => void;
  formControl?: React.ReactNode;
}

export default function EditPopoverForm<T>({
  formControl,
  label,
  defaultValue,
  onConfirm,
  ...props
}: EditPopoverFormProps<T>) {
  const [form] = Form.useForm();

  return (
    <Popconfirm
      {...props}
      icon={false}
      description={
        formControl && (
          <Form form={form} initialValues={{ value: defaultValue }}>
            <Form.Item name="value" label={label} style={{ marginBottom: 0 }}>
              {formControl}
            </Form.Item>
          </Form>
        )
      }
      onConfirm={() => {
        onConfirm?.(form.getFieldValue('value'));
        form.resetFields();
      }}
    />
  );
}
