import { getUserInfo } from '@/services';
import { Userinfo } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserinfoStore {
  data: Userinfo | null;
  permissions: Set<string>;
  loading: boolean;
  load: () => Promise<void>;
  clear: () => void;
}

export const useUserinfoStore = create<UserinfoStore>()(
  devtools<UserinfoStore>(
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
          const res = await getUserInfo();
          const data = res.data.data;
          // const permission_codes = [];
          set({
            data,
            // permissions: new Set<string>(permission_codes),
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
