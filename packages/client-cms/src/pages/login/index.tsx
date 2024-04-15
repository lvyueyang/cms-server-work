import LoginContainer from '@/components/LoginContainer';
import { TOKEN_KEY } from '@/constants';
import useUserInfo from '@/hooks/useUserInfo';
import { UserAdminLoginBody } from '@/interface/serverApi';
import { message } from '@/utils/notice';
import { Button, Form, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { history, Link } from 'umi';
import { login } from './modules';
import { useUserinfoStore } from '@/store/userinfo';

type LoginBody = UserAdminLoginBody;

export default function Login() {
  const [form] = Form.useForm<LoginBody>();
  const [loading, setLoading] = useState(false);
  const { load: loadUser } = useUserinfoStore();
  const submitHandler = async (formValue: LoginBody) => {
    setLoading(true);
    login(formValue)
      .then(({ data }) => {
        localStorage.setItem(TOKEN_KEY, data.data.token);
        message.success('登录成功');
        loadUser?.();
        history.push('/');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const historyState = history.location.state;
    if (historyState) {
      const { username, password } = historyState as Record<string, any>;
      if (username && password) {
        form.setFieldsValue({
          username,
          password,
        });
        history.replace('/login');
      }
    }
  }, []);
  return (
    <LoginContainer>
      <h3>
        <b>请登录</b>
      </h3>
      <br />
      <Form<LoginBody> colon={false} onFinish={submitHandler} style={{ width: 280 }} form={form}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名/邮箱" autoComplete="off" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="请输入您的密码" autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登陆
          </Button>
        </Form.Item>
        <Row justify="end" style={{ marginTop: -10 }}>
          <Space size={20}>
            <Link to="/nopassword">找回密码</Link>
            {/* <Link to="/register">注册</Link> */}
          </Space>
        </Row>
      </Form>
    </LoginContainer>
  );
}
