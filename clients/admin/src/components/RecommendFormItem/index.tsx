import { Form, FormItemProps, InputNumber } from 'antd';

const TIP = '0 为不推荐，大于 0 会在首页根据值进行排序展示，值越大排列越靠前';
export function RecommendFormItem(props: FormItemProps) {
  return (
    <Form.Item {...props} label="推荐等级" name="recommend" tooltip={TIP} extra={TIP}>
      <InputNumber min={0} />
    </Form.Item>
  );
}
