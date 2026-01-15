import { UserAdminBindEmailDto, UserAdminInfo } from '@cms/api-interface';
import { VALIDATE_CODE_TYPE } from '@cms/server/const';
import { useRequest } from 'ahooks';
import { Avatar, Button, Card, Divider, Flex, Form, Input, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import ValidateCodeInput from '@/components/ValidateCodeInput';
import { sendEmailCaptcha } from '@/services';
import { useUserinfoStore } from '@/store/userinfo';
import { message } from '@/utils/notice';
import { bindEmailApi, UpdatePasswordBody, updatePassword } from './module';

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
    { manual: true }
  );

  return (
    <Card
      style={{ maxWidth: 600, margin: '10px auto' }}
      title="修改密码"
    >
      <Form<UpdatePasswordBody>
        labelCol={{ span: 4 }}
        form={form}
        colon={false}
        onFinish={submitHandler}
      >
        <Form.Item
          label="旧密码"
          name="old_password"
          rules={[{ required: true }]}
        >
          <Input.Password style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true }]}
        >
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

        <Form.Item
          label=" "
          colon={false}
        >
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              确认修改
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default function UserInfoPage() {
  const { data: userInfo, load: loadUser } = useUserinfoStore();
  const [form] = Form.useForm<FormValues>();
  const [bindEmailModalVisible, setBindEmailModalVisible] = useState(false);

  useEffect(() => {
    loadUser?.();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...userInfo });
  }, [userInfo]);

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Form<FormValues>
          labelCol={{ span: 4 }}
          form={form}
          colon={false}
        >
          <Form.Item label="头像">
            <Avatar
              size="large"
              src={userInfo?.avatar}
            >
              {userInfo?.username}
            </Avatar>
          </Form.Item>
          <Form.Item label="姓名">
            <Space>
              <Input
                readOnly
                style={{ width: 300 }}
                value={userInfo?.cname}
              />
            </Space>
          </Form.Item>
          <Form.Item label="用户名">
            <Space>
              <Input
                readOnly
                style={{ width: 300 }}
                value={userInfo?.username}
              />
            </Space>
          </Form.Item>
          <Form.Item label="邮箱">
            <Space>
              <Input
                readOnly
                style={{ width: 300 }}
                value={userInfo?.email}
              />
              <Button
                type="primary"
                onClick={() => {
                  setBindEmailModalVisible(true);
                }}
              >
                换绑
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      {/* <UpdatePassword /> */}
      <div style={{ height: 200 }}></div>
      <Modal
        title="邮箱绑定"
        open={bindEmailModalVisible}
        onCancel={() => setBindEmailModalVisible(false)}
        footer={null}
        width={400}
      >
        <BindEmail
          oldEmail={userInfo?.email || ''}
          onSuccess={() => {
            setBindEmailModalVisible(false);
            loadUser?.();
          }}
        />
      </Modal>
    </>
  );
}

interface BindEmailProps {
  oldEmail: string;
  onSuccess: () => void;
}
function BindEmail({ oldEmail, onSuccess }: BindEmailProps) {
  const [form] = Form.useForm<UserAdminBindEmailDto>();
  const { run: submitHandler, loading } = useRequest(
    () => {
      const values = form.getFieldsValue();
      console.log('values: ', values);
      return bindEmailApi({
        old_email_code: values.old_email_code,
        new_email: values.new_email,
        new_email_code: values.new_email_code,
      }).then(() => {
        message.success('绑定成功');
        form.resetFields();
        onSuccess?.();
        return {};
      });
    },
    { manual: true }
  );

  return (
    <Form
      labelCol={{ flex: '70px' }}
      form={form}
    >
      <Divider>旧邮箱</Divider>
      <Form.Item label="旧邮箱">
        <div>{oldEmail}</div>
      </Form.Item>
      <Form.Item
        label="验证码"
        name="old_email_code"
        rules={[{ required: true }]}
        required
      >
        <ValidateCodeInput
          targetValue={oldEmail}
          sendRequest={({ code, hash }) =>
            sendEmailCaptcha({
              email: oldEmail,
              image_code: code,
              image_code_hash: hash,
              type: VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_OLD,
            })
          }
        />
      </Form.Item>
      <Divider>新邮箱</Divider>
      <Form.Item
        label="新邮箱"
        name="new_email"
        required
        rules={[{ required: true, type: 'email' }]}
      >
        <Input placeholder="请输入新邮箱地址" />
      </Form.Item>
      <Form.Item
        dependencies={['new_email']}
        label="验证码"
        required
      >
        {({ getFieldValue }) => (
          <Form.Item
            noStyle
            name="new_email_code"
            rules={[{ required: true }]}
          >
            <ValidateCodeInput
              targetValue={getFieldValue('new_email')}
              sendRequest={({ code, hash }) =>
                sendEmailCaptcha({
                  email: getFieldValue('new_email'),
                  image_code: code,
                  image_code_hash: hash,
                  type: VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_NEW,
                })
              }
            />
          </Form.Item>
        )}
      </Form.Item>
      <Flex justify="center">
        <Button
          type="primary"
          onClick={submitHandler}
          loading={loading}
        >
          确定
        </Button>
      </Flex>
    </Form>
  );
}
