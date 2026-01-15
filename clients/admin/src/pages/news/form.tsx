import { LowCodeEditor } from '@/components/LowcodeEditor';
import UploadImage from '@/components/UploadImage';
import { NewsCreateDto, NewsUpdateDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, Card, DatePicker, Form, Input, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { history, useParams } from 'umi';
import { createApi, getDetailApi, updateApi } from './module';
import dayjs from 'dayjs';
import { RecommendFormItem } from '@/components/RecommendFormItem';

type FormValues = NewsUpdateDto | NewsUpdateDto;

export default function NewsFormPage() {
  const { id } = useParams();
  const isUpdate = !!id;
  const [form] = Form.useForm<FormValues>();
  const { run: submitHandler, loading } = useRequest(
    async () => {
      const values = form.getFieldsValue();
      if (isUpdate) {
        await updateApi({
          ...values,
          ...(values.push_date
            ? { push_date: dayjs(values.push_date).format('YYYY-MM-DD HH:mm') }
            : void 0),
        } as NewsUpdateDto);
        message.success('更新成功');
      } else {
        await createApi({
          ...values,
          ...(values.push_date
            ? { push_date: dayjs(values.push_date).format('YYYY-MM-DD HH:mm') }
            : void 0),
        } as NewsCreateDto);
        history.push('/news/list');
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
          push_date: res.data.data.push_date
            ? (dayjs(res.data.data.push_date) as unknown as string)
            : void 0,
        });
      });
    }
  }, [id]);

  return (
    <Card style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Form<FormValues> form={form} onFinish={submitHandler} labelCol={{ flex: '100px' }}>
        <Form.Item label="新闻ID" name="id" hidden={!id}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="新闻标题" name="title" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="是否上架" name="is_available" valuePropName="checked">
          <Switch checkedChildren="上架" unCheckedChildren="下架" />
        </Form.Item>
        <Form.Item
          label="新闻封面"
          name="cover"
          rules={[{ required: true, message: '请上传新闻封面' }]}
        >
          <UploadImage />
        </Form.Item>
        <Form.Item label="发布日期" name="push_date">
          <DatePicker format={'YYYY-MM-DD HH:mm'} showTime />
        </Form.Item>
        <RecommendFormItem />
        <Form.Item label="新闻描述" name="desc">
          <Input.TextArea placeholder="可选输入" />
        </Form.Item>
        <Form.Item
          label="新闻详情"
          name="content"
          rules={[{ required: true, validateTrigger: 'submit' }]}
        >
          <LowCodeEditor />
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
