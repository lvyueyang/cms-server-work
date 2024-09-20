import { BreadcrumbProps } from 'antd';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GlobalStore {
  /** 顶栏面包屑配置 */
  headerBreadcrumbItems: BreadcrumbProps['items'];
  updateHeaderBreadcrumbItems: (items: GlobalStore['headerBreadcrumbItems']) => void;
}

export const globalStore = create<GlobalStore>()(
  devtools<GlobalStore>(
    (set) => ({
      headerBreadcrumbItems: [],
      updateHeaderBreadcrumbItems: (items) => {
        set({ headerBreadcrumbItems: items });
      },
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

export const useGlobalStore = globalStore;
