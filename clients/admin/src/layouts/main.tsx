import Layout from '@/components/Layout';
import { useDictStore } from '@/store/dict';
import { useUserinfoStore } from '@/store/userinfo';
import { Outlet } from '@tanstack/react-router';
import { Skeleton } from 'antd';
import { useEffect } from 'react';

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
