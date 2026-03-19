import { Count } from '../../components/Count';
import { MainLayout } from '../../layouts/main';

export function HomePage() {
  return <MainLayout>
    <div>这是首页</div>
    <hr />
    <Count/>
  </MainLayout>
}