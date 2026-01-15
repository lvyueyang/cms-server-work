import { ConfirmPasswordItem } from '@/components/ConfirmPasswordItem';
import LoginContainer from '@/components/LoginContainer';
import ValidateCodeInput from '@/components/ValidateCodeInput';
import { SendPhoneCaptchaType } from '@/constants';
import { App, Button, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { Link, history } from 'umi';
import { forgetPassword } from './modules';
import { sendEmailCaptcha } from '@/services';
import { VALIDATE_CODE_TYPE } from '@cms/server/const';
import { CloseAutoComplete } from '@/components/CloseAutoComplete';

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
        <CloseAutoComplete />
        <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
          <Input type="email" placeholder="请输入您的邮箱" autoComplete="off" />
        </Form.Item>
        <Form.Item dependencies={['email']} label="验证码" required>
          {({ getFieldValue }) => (
            <Form.Item noStyle name="code" rules={[{ required: true }]}>
              <ValidateCodeInput
                targetValue={getFieldValue('email')}
                sendRequest={({ code, hash }) =>
                  sendEmailCaptcha({
                    email: getFieldValue('email'),
                    image_code: code,
                    image_code_hash: hash,
                    type: VALIDATE_CODE_TYPE.ADMIN_USER_FORGET_PASSWORD,
                  })
                }
              />
            </Form.Item>
          )}
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
