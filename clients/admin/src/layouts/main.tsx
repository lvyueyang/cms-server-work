import Layout from '@/components/Layout';
import { useDictStore } from '@/store/dict';
import { useUserinfoStore } from '@/store/userinfo';
import { Skeleton } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'umi';

export default function DefaultLayout() {
  const { data: user, load } = useUserinfoStore();
  const dict = useDictStore();
  useEffect(() => {
    load();
    dict.init();
  }, []);
  if (!user) return <Skeleton />;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
