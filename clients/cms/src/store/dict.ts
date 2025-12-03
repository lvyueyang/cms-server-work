import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DictTypeInfo } from '@cms/api-interface';
import { getListAllApi } from '../pages/dict/module';

interface DictStore {
  list: DictTypeInfo[];
  loading: boolean;
  load: () => Promise<void>;
  init: () => Promise<void>;
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
}));

export const useDictStore = dictStore;
