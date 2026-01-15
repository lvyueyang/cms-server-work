import { Form, FormItemProps, Input } from 'antd';

interface ConfirmPasswordItemProps extends FormItemProps {
  relevanceField?: string;
}

export function ConfirmPasswordItem({ relevanceField = 'password', ...props }: ConfirmPasswordItemProps) {
  return (
    <Form.Item
      label="确认密码"
      name="confirmPassword"
      dependencies={[relevanceField]}
      {...props}
      rules={[
        { required: true },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue(relevanceField) === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次密码输入不一致'));
          },
        }),
        ...(props.rules || []),
      ]}
    >
      <Input.Password
        placeholder="请确认您的密码"
        autoComplete="off"
      />
    </Form.Item>
  );
}
