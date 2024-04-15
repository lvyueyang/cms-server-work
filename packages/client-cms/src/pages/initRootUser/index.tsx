import { ConfirmPasswordItem } from '@/components/ConfirmPasswordItem';
import LoginContainer from '@/components/LoginContainer';
import { UserAdminCreateRootDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { Alert, Button, Form, Input, Popover, Result } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import { initRootUser } from './modules';

type FormValues = UserAdminCreateRootDto;

export default function InitRootUserPage() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const submitHandler = async (formValue: FormValues) => {
    setLoading(true);
    initRootUser(formValue)
      .then(() => {
        message.success('超级管理员账户创建成功');
        setSuccess(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <LoginContainer>
      {success && (
        <Result
          status="success"
          title="管理员账户创建成功！"
          subTitle="您可以点击下方登录按钮去登录系统"
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => {
                history.replace(`/login`, {
                  username: form.getFieldValue('username'),
                  password: form.getFieldValue('password'),
                });
              }}
            >
              登录
            </Button>,
          ]}
        />
      )}
      <div style={{ display: success ? 'none' : '' }}>
        <h3>
          <b>初始化超级管理员账户</b>
        </h3>
        <br />
        <Form<FormValues>
          form={form}
          colon={false}
          onFinish={submitHandler}
          style={{ width: 280 }}
          initialValues={{
            cname: '超级管理员',
          }}
        >
          <Form.Item name="cname" rules={[{ required: true, message: '请输入超管用户昵称' }]}>
            <Input placeholder="请输入超管用户昵称" autoComplete="off" />
          </Form.Item>
          <Popover
            content={
              <Alert
                type="warning"
                showIcon
                message="请务必输入您的真实邮箱地址，以便用于密码重置!"
              />
            }
            overlayStyle={{ padding: 0 }}
          >
            <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input type="email" placeholder="请输入邮箱" autoComplete="off" />
            </Form.Item>
          </Popover>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" autoComplete="off" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入您的密码" autoComplete="off" />
          </Form.Item>
          <ConfirmPasswordItem label={false} />
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              确认创建
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LoginContainer>
  );
}
