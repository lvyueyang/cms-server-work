import { useRequest } from 'ahooks';
import { Flex, Input } from 'antd';
import { getImageCode } from '@/services';

interface ImageCodeProps {
  value?: {
    code: string;
    hash: string;
  };
  onChange?: (value: ImageCodeProps['value']) => void;
}

export function ImageCode({ value, onChange }: ImageCodeProps) {
  const { data, runAsync } = useRequest(() => {
    return getImageCode().then((res) => res.data);
  });
  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: 45 }}
    >
      <Input
        placeholder="请输入验证码"
        value={value?.code}
        autoComplete="off"
        onChange={(e) => {
          onChange?.({ code: e.target.value, hash: data?.hash || '' });
        }}
      />
      <div
        style={{ cursor: 'pointer', width: 150, height: 50 }}
        onClick={() => {
          runAsync().then(() => {
            onChange?.({ code: value?.code || '', hash: data?.hash || '' });
          });
        }}
        dangerouslySetInnerHTML={{ __html: data?.data || '' }}
        title="点击刷新验证码"
      ></div>
    </Flex>
  );
}
