import { DictTypeInfo } from '@cms/api-interface';
import { create } from 'zustand';
import { getListAllApi } from '../pages/dict/module';

interface DictStore {
  list: DictTypeInfo[];
  loading: boolean;
  load: () => Promise<void>;
  init: () => Promise<void>;
  getEnum: (type: string) => Record<string, string>;
}

export const dictStore = create<DictStore>()((set, get) => ({
  list: [],
  loading: false,
  load: () => {
    set({ loading: true });
    return getListAllApi()
      .then((res) => {
        set({
          list: res.data.data,
          loading: false,
        });
      })
      .catch(() => {
        set({ loading: false });
      });
  },
  init() {
    if (!get().list.length) {
      return get().load();
    }
    return Promise.resolve();
  },
  getEnum(type: string) {
    const list = get().list.find((item) => item.type === type)?.values || [];
    return list.reduce((prev, cur) => {
      prev[cur.value] = cur.label;
      return prev;
    }, {} as Record<string, string>);
  },
}));

export const useDictStore = dictStore;
