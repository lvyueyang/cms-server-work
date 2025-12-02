import { ContentLang } from '@/constants';
import { renderToString } from 'react-dom/server';
import { BaseLayout } from './components/BaseLayout';

interface PageProps {
  title: string;
  content: string;
  description?: string;
  styles?: string[];
  scripts?: string[];
  meta?: Record<string, string>;
  lang?: ContentLang;
}

export class ReactTemplateEngine {
  render = renderToString;

  renderJSX(component: React.ReactElement) {
    return renderToString(<JSXWrapper component={component} />);
  }

  renderPageHtml(options: PageProps): string {
    const metaDescription = this.escapeHtml(options.description || '');
    const title = this.escapeHtml(options.title);
    const metaTags =
      Object.entries(options.meta || {})
        .map(([key, value]) => `<meta name="${key}" content="${this.escapeHtml(value)}">`)
        .join('\n') || '';
    const styles =
      options.styles?.map((style) => `<link rel="stylesheet" href="${style}">`).join('\n') || '';
    const scripts =
      options.scripts?.map((script) => `<script src="${script}"></script>`).join('\n') || '';
    return `<!DOCTYPE html>
<html lang="${options.lang || ContentLang.ZH_CN}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${metaDescription}">
    <title>${title}</title>
    ${metaTags}
    ${styles}
</head>
<body>
    ${options.content}
    ${scripts}
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
