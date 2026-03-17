import Layout from '@/components/Layout';
import { useDictStore } from '@/store/dict';
import { useUserinfoStore } from '@/store/userinfo';
import { Skeleton } from 'antd';
import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';

export default function DefaultLayout() {
  const { data: user, loading, load } = useUserinfoStore();
  const dict = useDictStore();

  useEffect(() => {
    load();
    dict.init();
  }, []);

  if (loading && !user) {
    return <Skeleton active />;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
