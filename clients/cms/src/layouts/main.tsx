import Layout from '@/components/Layout';
import { useUserinfoStore } from '@/store/userinfo';
import { Skeleton } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'umi';

export default function DefaultLayout() {
  const { data: user, load } = useUserinfoStore();
  useEffect(() => {
    load();
  }, []);
  if (!user) return <Skeleton />;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
