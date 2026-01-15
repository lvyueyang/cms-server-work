import { Footer } from '../pageFooter/view';
import { Header } from '../pageHeader/view';

export interface BaseLayoutProps {
  children?: React.ReactNode;
}

// 基础布局组件
export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <Header />
      <main className="baseLayoutContainer">{children}</main>
      <Footer />
    </>
  );
}
