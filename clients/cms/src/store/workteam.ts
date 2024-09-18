import { getWorkteamList } from '@/services';
import { WorkTeam } from 'interface/serverApi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type DataItem = Required<WorkTeam>;

interface WorkteamListStore {
  data: DataItem[] | null;
  loading: boolean;
  load: () => Promise<void>;
  clear: () => void;
}

export const workteamListStore = create<WorkteamListStore>()(
  devtools<WorkteamListStore>(
    (set) => ({
      loading: false,
      data: null,
      permissions: new Set<string>(),
      clear: () => {
        set({ data: null, loading: false });
      },
      load: async () => {
        set({ loading: true });
        try {
          const res = await getWorkteamList();
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
workteamListStore.getState().load();

export const useWorkteamListStore = workteamListStore;
