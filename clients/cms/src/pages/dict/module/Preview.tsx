import { useDictStore, dictStore } from '@/store/dict';

type DictPreviewProps = { type: string; value: string };
export const DictPreview = function (props: DictPreviewProps) {
  const dictStore = useDictStore();
  const currentType = dictStore.list?.find((o) => o.type === props.type);
  return <>{currentType?.values.find((d) => d.value === props.value)?.label}</>;
};

export const getDictLabel = (type: string, value: string) => {
  const currentType = dictStore()?.list?.find((o) => o.type === type);
  return currentType?.values.find((d) => d.value === value)?.label;
};
