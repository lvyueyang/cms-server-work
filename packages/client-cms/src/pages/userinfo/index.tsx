import { UserAdminInfo } from '@/interface/serverApi';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, Space } from 'antd';
import { useEffect } from 'react';
import { updatePassword, UpdatePasswordBody } from './module';
import { useUserinfoStore } from '@/store/userinfo';

type FormValues = UserAdminInfo;

function UpdatePassword() {
  const [form] = Form.useForm<UpdatePasswordBody>();
  const { run: submitHandler, loading } = useRequest(
    () => {
      const values = form.getFieldsValue();
      return updatePassword(values).then(() => {
        message.success('更新成功');
        form.resetFields();
        return {};
      });
    },
    { manual: true },
  );

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '10px auto' }} title="修改密码">
        <Form<UpdatePasswordBody>
          labelCol={{ span: 4 }}
          form={form}
          colon={false}
          onFinish={submitHandler}
        >
          <Form.Item label="旧密码" name="old_password" rules={[{ required: true }]}>
            <Input.Password style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="新密码" name="password" rules={[{ required: true }]}>
            <Input.Password style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
export default function UserInfoPage() {
  const { data: userInfo, load: loadUser } = useUserinfoStore();

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    loadUser?.();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...userInfo });
  }, [userInfo]);

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Form<FormValues> labelCol={{ span: 4 }} form={form} colon={false}>
          <Form.Item label="用户名">
            <Space>
              <Input readOnly style={{ width: 300 }} value={userInfo?.username} />
            </Space>
          </Form.Item>
          <Form.Item label="邮箱">
            <Space>
              <Input readOnly style={{ width: 300 }} value={userInfo?.email} />
            </Space>
          </Form.Item>
          <Form.Item label="姓名">
            <Space>
              <Input readOnly style={{ width: 300 }} value={userInfo?.cname} />
            </Space>
          </Form.Item>
        </Form>
      </Card>
      {/* <UpdatePassword /> */}
      <div style={{ height: 200 }}></div>
    </>
  );
}
