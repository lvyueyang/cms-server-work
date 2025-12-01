import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DictTypeInfo } from '@cms/api-interface';
import { getListAllApi } from '../pages/dict/module';

interface DictStore {
  list: DictTypeInfo[];
  loading: boolean;
  load: () => Promise<void>;
}

export const dictStore = create<DictStore>()(
  devtools<DictStore>(
    (set) => ({
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
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

export const useDictStore = dictStore;
