import Editor from '@/components/Editor';
import UploadImage from '@/components/UploadImage';
import { {{entityName}}UpdateDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { history, useParams } from 'umi';
import { createApi, getDetailApi, updateApi } from './module';

type FormValues = {{entityName}}UpdateDto;

export default function {{entityName}}Form() {
  const { id } = useParams();
  const isUpdate = !!id;
  const [form] = Form.useForm<FormValues>();
  const { run: submitHandler, loading } = useRequest(
    async () => {
      const values = form.getFieldsValue();
      if (isUpdate) {
        await updateApi(id, {
          ...values
        });
        message.success('更新成功');
      } else {
        await createApi(values);
        history.push('/{{pathName}}');
        message.success('创建成功');
      }
    },
    { manual: true },
  );

  useEffect(() => {
    if (id) {
      getDetailApi(Number(id)).then((res) => {
        form.setFieldsValue(res.data.data);
      });
    }
  }, [id]);

  return (
    <>
      <Card style={{'{{'}} maxWidth: 1000, margin: '0 auto' {{'}}'}}>
        <Form<FormValues> form={form} onFinish={submitHandler}  labelCol={{'{{'}} xs: 3 {{'}}'}}>
          <Form.Item label="{{cname}}标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="{{cname}}封面"
            name="cover"
            rules={[{ required: true, message: '请上传{{cname}}封面' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item label="{{cname}}描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="{{cname}}详情"
            name="content"
            rules={[{ required: true, validateTrigger: 'submit' }]}
          >
            <Editor style={{ '{{' }} height: 400 {{ '}}' }} />
          </Form.Item>
          <Form.Item label=" ">
            <Row justify="center">
              <Button style={{ '{{' }} width: 160 {{ '}}' }} type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
