import Layout from '@/components/Layout';
import { Outlet } from 'umi';

export default function DefaultLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
