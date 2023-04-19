import { ConfirmPasswordItem } from '@/components/ConfirmPasswordItem';
import LoginContainer from '@/components/LoginContainer';
import ValidateCodeInput from '@/components/ValidateCodeInput';
import { SEND_TYPE, SEND_VALIDATE_CODE_TYPE } from '@/constants';
import { UserAdminForgetPasswordDto } from '@/interface/serverApi';
import { App, Button, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { history, Link } from 'umi';
import { forgetPassword } from './modules';

type FormValues = UserAdminForgetPasswordDto;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const email = Form.useWatch<FormValues['email']>('email', form);
  const { modal } = App.useApp();

  const submitHandler = async (formValue: FormValues) => {
    console.log('formValue: ', formValue);
    setLoading(true);
    forgetPassword({
      ...formValue,
    })
      .then(() => {
        modal.confirm({
          title: '密码修改成功',
          okText: '去登陆',
          cancelButtonProps: {
            style: {
              display: 'none',
            },
          },
          onOk: () => {
            history.replace('/login');
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <LoginContainer>
      <h3>
        <b>忘记密码</b>
      </h3>
      <br />
      <Form<FormValues>
        form={form}
        colon={false}
        labelCol={{ span: 6 }}
        onFinish={submitHandler}
        style={{ width: 400 }}
      >
        <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
          <ValidateCodeInput
            targetValue={email}
            sendType={SEND_VALIDATE_CODE_TYPE.EMAIL.id}
            actionType={SEND_TYPE.NOPASSWORD.id}
          />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入您的密码" autoComplete="off" />
        </Form.Item>
        <ConfirmPasswordItem />
        <Form.Item label=" ">
          <Button type="primary" htmlType="submit" block loading={loading}>
            提交
          </Button>
        </Form.Item>
        <Row justify="end" style={{ marginTop: -10 }}>
          <Space size={20}>
            <Link to="/register">注册</Link>
            <Link to="/login">去登录</Link>
          </Space>
        </Row>
      </Form>
    </LoginContainer>
  );
}
