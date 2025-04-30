import Editor from '@/components/Editor';
import UploadImage from '@/components/UploadImage';
import { {{entityName}}UpdateDto, {{entityName}}CreateDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, DatePicker, Form, Input, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { history, useParams } from 'umi';
import { createApi, getDetailApi, updateApi } from './module';
import { RecommendFormItem } from '@/components/RecommendFormItem';

type FormValues = {{entityName}}CreateDto | {{entityName}}UpdateDto;

export default function {{entityName}}FormPage() {
  const { id } = useParams();
  const isUpdate = !!id;
  const [form] = Form.useForm<FormValues>();
  const { run: submitHandler, loading } = useRequest(
    async () => {
      const values = form.getFieldsValue();
      if (isUpdate) {
        await updateApi({
          ...values,
        } as {{entityName}}UpdateDto);
        message.success('更新成功');
      } else {
        await createApi({
          ...values,
        } as {{entityName}}CreateDto);
        history.push('/{{name}}/list');
        message.success('创建成功');
      }
    },
    { manual: true },
  );

  useEffect(() => {
    if (id) {
      getDetailApi(Number(id)).then((res) => {
        form.setFieldsValue({
          ...res.data.data
        });
      });
    }
  }, [id]);

  return (
    <div style={{'{{'}} maxWidth: 1000, margin: '0 auto', padding: '20px' {{'}}'}}>
      <Form<FormValues> form={form} onFinish={submitHandler} labelCol={{'{{'}} xs: 3 {{'}}'}}>
        <Form.Item label="{{cname}}ID" name="id" hidden={!id}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="{{cname}}标题" name="title" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="是否上架" name="is_available" valuePropName="checked">
          <Switch checkedChildren="上架" unCheckedChildren="下架" />
        </Form.Item>
        <Form.Item
          label="{{cname}}封面"
          name="cover"
          rules={[{ required: true, message: '请上传{{cname}}封面' }]}
        >
          <UploadImage />
        </Form.Item>
        <RecommendFormItem />
        <Form.Item label="{{cname}}描述" name="desc">
          <Input.TextArea placeholder="可选输入" />
        </Form.Item>
        <Form.Item
          label="{{cname}}详情"
          name="content"
          rules={[{ required: true, validateTrigger: 'submit' }]}
        >
          <Editor style={{'{{'}} height: 400 {{'}}'}} />
        </Form.Item>
        <Form.Item label=" ">
          <Row justify="center">
            <Button style={{'{{'}} width: 160 {{'}}'}} type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}
