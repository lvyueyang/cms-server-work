import { cloneElement, ComponentType, createElement, ReactElement, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { RenderViewService } from './render_view.service';

interface PageProps {
  title: string;
  content: string;
  description?: string;
  styles?: string[];
  scripts?: string[];
  meta?: Record<string, string>;
}

export class ReactTemplateEngine {
  render = renderToString;

  renderJSX(component: React.ReactElement) {
    return renderToString(<JSXWrapper component={component} />);
  }

  renderPageHtml(options: PageProps): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${this.escapeHtml(options.description || '')}">
    <title>${this.escapeHtml(options.title)}</title>
    ${
      Object.entries(options.meta || {})
        .map(([key, value]) => `<meta name="${key}" content="${this.escapeHtml(value)}">`)
        .join('\n') || ''
    }
    ${options.styles?.map((style) => `<link rel="stylesheet" href="${style}">`).join('\n') || ''}
</head>
<body>
    ${options.content}
    ${options.scripts?.map((script) => `<script src="${script}"></script>`).join('\n') || ''}
</body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

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

interface ErrorPageProps {
  title: string;
  message?: string;
}
// 错误页面组件
export const ErrorPage: React.FC<ErrorPageProps> = ({ title, message }) => {
  return (
    <BaseLayout>
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: '#dc3545' }}>{title}</h1>
        <p>{message || '抱歉，页面加载时发生错误。'}</p>
        <a href="/" style={{ color: '#007bff' }}>
          返回首页
        </a>
      </div>
    </BaseLayout>
  );
};

// JSX包装器组件 - 用于直接渲染传入的JSX组件
export const JSXWrapper: React.FC<{ component: React.ReactElement }> = ({ component }) => {
  return component;
};

export function getBaseLayout() {
  const Comp: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return <BaseLayout>{children}</BaseLayout>;
  };
  return Comp;
}
