import UploadImage from '@/components/UploadImage';
import { PublicArticleUpdateDto, PublicArticleCreateDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, Row, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { history, useParams } from 'umi';
import { createApi, getDetailApi, updateApi } from './module';
import { RecommendFormItem } from '@/components/RecommendFormItem';
import { enumMapToOptions } from '@/utils';
import { ContentType, ContentTypeMap } from '@/constants';
import { AutoContentInput } from '@/components/AutoContentInput';

type FormValues = PublicArticleCreateDto | PublicArticleUpdateDto;

export default function PublicArticleFormPage() {
  const { id } = useParams();
  const isUpdate = !!id;
  const [form] = Form.useForm<FormValues>();
  const { run: submitHandler, loading } = useRequest(
    async () => {
      const values = form.getFieldsValue();
      if (isUpdate) {
        await updateApi({
          ...values,
        } as PublicArticleUpdateDto);
        message.success('更新成功');
      } else {
        await createApi({
          ...values,
        } as PublicArticleCreateDto);
        history.push('/public-article/list');
        message.success('创建成功');
      }
    },
    { manual: true },
  );

  useEffect(() => {
    if (id) {
      getDetailApi(Number(id)).then((res) => {
        form.setFieldsValue({
          ...res.data.data,
        });
      });
    }
  }, [id]);

  return (
    <Card
      style={{ maxWidth: 1000, margin: '0 auto' }}
      title={isUpdate ? '更新开放文章' : '创建开放文章'}
      extra={
        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            form.submit();
          }}
        >
          提交
        </Button>
      }
    >
      <Form<FormValues>
        form={form}
        onFinish={submitHandler}
        labelCol={{ flex: '80px' }}
        initialValues={{
          content_type: ContentType.Rich,
        }}
      >
        <Form.Item label="ID" name="id" hidden={!id}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="编码" name="code" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="标题" name="title" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="是否上架" name="is_available" valuePropName="checked">
          <Switch checkedChildren="上架" unCheckedChildren="下架" />
        </Form.Item>
        <Form.Item
          label="封面"
          name="cover"
          rules={[{ required: true, message: '请上传开放文章封面' }]}
        >
          <UploadImage />
        </Form.Item>
        <RecommendFormItem />
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="可选输入描述内容" />
        </Form.Item>
        <Form.Item label="内容类型" name="content_type">
          <Select
            placeholder="可选"
            options={enumMapToOptions(ContentTypeMap)}
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item label="详情" dependencies={['content_type']}>
          {() => {
            const attrType = form.getFieldValue('content_type');
            return (
              <Form.Item noStyle name="content">
                <AutoContentInput type={attrType} />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item label=" ">
          <Row justify="center">
            <Button style={{ width: 160 }} type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
}
