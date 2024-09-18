import { ConfirmPasswordItem } from '@/components/ConfirmPasswordItem';
import LoginContainer from '@/components/LoginContainer';
import ValidateCodeInput from '@/components/ValidateCodeInput';
import { SendPhoneCaptchaType } from '@/constants';
import { App, Button, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { Link, history } from 'umi';
import { forgetPassword } from './modules';

type FormValues = any;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const { modal } = App.useApp();
  const phone = Form.useWatch('phone', form);

  const submitHandler = async (formValue: FormValues) => {
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
        labelCol={{ flex: '100px' }}
        onFinish={submitHandler}
        style={{ width: 400 }}
      >
        <Form.Item label="手机号" name="phone" rules={[{ required: true }]}>
          <Input placeholder="请输入您的手机号" />
        </Form.Item>
        <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
          <ValidateCodeInput
            targetValue={phone}
            sendRequest={() => sendSMSCaptcha(phone, SendPhoneCaptchaType.ForgetPassword)}
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
            {/* <Link to="/register">注册</Link> */}
            <Link to="/login">去登录</Link>
          </Space>
        </Row>
      </Form>
    </LoginContainer>
  );
}
