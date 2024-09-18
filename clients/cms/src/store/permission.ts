import { getPermissionRegionList, getPermissionUrlList } from '@/services';
import { RegionResource, UrlResource } from 'interface/serverApi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PermissionStore {
  urlList: UrlResource[] | null;
  regionList: RegionResource[] | null;
  loading: boolean;
  load: () => Promise<void>;
  clear: () => void;
}

export const permissionStore = create<PermissionStore>()(
  devtools<PermissionStore>(
    (set) => ({
      loading: false,
      urlList: null,
      regionList: null,
      clear: () => {
        set({ urlList: null, regionList: null, loading: false });
      },
      load: async () => {
        set({ loading: true });
        try {
          const [urlList, regionList] = await Promise.all([
            getPermissionUrlList(),
            getPermissionRegionList(),
          ]);
          set({
            urlList: urlList.data.data,
            regionList: regionList.data.data,
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
permissionStore.getState().load();

export const usePermissionStore = permissionStore;
