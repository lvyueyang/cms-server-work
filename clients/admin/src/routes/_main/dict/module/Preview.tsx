import { useDictStore, dictStore } from '@/store/dict';
import { Link } from '@tanstack/react-router';
import { LinkOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';

type DictPreviewProps = { type: string; value: string };
export const DictPreview = function (props: DictPreviewProps) {
  const dictStore = useDictStore();
  const currentType = dictStore.list?.find((o) => o.type === props.type);
  const currentValue = currentType?.values.find((d) => d.value === props.value);
  return (
    <Space>
      <Tooltip title={currentValue?.value}>
        <span>{currentValue?.label}</span>
      </Tooltip>
      {currentType?.id ? (
        <Link to="/dict/$id" params={{ id: String(currentType.id) }}>
          <LinkOutlined />
        </Link>
      ) : null}
    </Space>
  );
};

export const getDictLabel = (type: string, value: string) => {
  const currentType = dictStore()?.list?.find((o) => o.type === type);
  return currentType?.values.find((d) => d.value === value)?.label;
};
