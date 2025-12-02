export interface BaseLayoutProps {
  children?: React.ReactNode;
  // title: string;
  // siteName: string;
  // currentYear: number;
}

// 基础布局组件
export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <header style={{ background: '#f0f0f0', padding: '20px', marginBottom: '20px' }}>
        <h1>CMS</h1>
        <nav>
          <a href="/" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>
            首页
          </a>
          <a href="/news" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>
            新闻
          </a>
          <a href="/about" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>
            关于我们
          </a>
          <a href="/contact" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>
            联系我们
          </a>
        </nav>
      </header>

      <main style={{ minHeight: '400px', padding: '0 20px' }}>{children}</main>

      <footer
        style={{ background: '#f0f0f0', padding: '10px', marginTop: '20px', textAlign: 'center' }}
      >
        <p>&copy; 2025. 版权所有.</p>
      </footer>
    </>
  );
};
