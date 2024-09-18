import Editor from '@/components/Editor';
import UploadImage from '@/components/UploadImage';
import { NewsUpdateDto } from '@cms/api-interface';
import { message } from '@/utils/notice';
import { useRequest } from 'ahooks';
import { Button, Card, DatePicker, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { history, useParams } from 'umi';
import { createApi, getDetailApi, updateApi } from './module';
import dayjs from 'dayjs';

type FormValues = NewsUpdateDto;

export default function NewsForm() {
  const { id } = useParams();
  const isUpdate = !!id;
  const [form] = Form.useForm<FormValues>();
  const { run: submitHandler, loading } = useRequest(
    async () => {
      const values = form.getFieldsValue();
      if (isUpdate) {
        await updateApi(id, {
          ...values,
          ...(values.push_date
            ? { push_date: dayjs(values.push_date).format('YYYY-MM-DD HH:mm') }
            : void 0),
        });
        message.success('更新成功');
      } else {
        await createApi({
          ...values,
          ...(values.push_date
            ? { push_date: dayjs(values.push_date).format('YYYY-MM-DD HH:mm') }
            : void 0),
        });
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
    <>
      <Card style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Form<FormValues> form={form} onFinish={submitHandler} labelCol={{ xs: 3 }}>
          <Form.Item label="新闻标题" name="title" rules={[{ required: true }]}>
            <Input />
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
          <Form.Item
            label="推荐等级"
            name="recommend"
            help="0 为不推荐，大于 0 会在首页根据值进行排序展示，值越大排列越靠前"
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="新闻描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="新闻详情"
            name="content"
            rules={[{ required: true, validateTrigger: 'submit' }]}
          >
            <Editor style={{ height: 400 }} />
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
    </>
  );
}
