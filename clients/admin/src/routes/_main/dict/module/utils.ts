import { DictValueInfo } from '@cms/api-interface';

export function dictToEnum(list: DictValueInfo[]) {
  return list.reduce(
    (prev, cur) => {
      prev[cur.value] = cur.label;
      return prev;
    },
    {} as Record<string, string>,
  );
}
