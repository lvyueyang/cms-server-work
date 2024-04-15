import { getRegionList } from '@/services';
import { Region } from 'interface/serverApi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type DataItem = Required<Region>;

interface RegionListStore {
  data: DataItem[] | null;
  loading: boolean;
  load: () => Promise<void>;
  clear: () => void;
}

export const regionListStore = create<RegionListStore>()(
  devtools<RegionListStore>(
    (set) => ({
      loading: false,
      data: null,
      clear: () => {
        set({ data: null, loading: false });
      },
      load: async () => {
        set({ loading: true });
        try {
          const res = await getRegionList();
          const data = res.data.data.records;
          set({
            data,
          });
        } catch (e) {}
        set({ loading: false });
      },
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);
regionListStore.getState().load();

export const useRegionListStore = regionListStore;
