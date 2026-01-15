import { renderToString } from 'react-dom/server';
import { ContentLang } from '@/constants';

interface PageProps {
  title: string;
  content: string;
  description?: string;
  keywords?: string;
  styles?: string[];
  scripts?: string[];
  meta?: Record<string, string>;
  lang?: ContentLang;
  header?: string;
  globalHeader?: string;
  globalFooter?: string;
}

export class ReactTemplateEngine {
  render = renderToString;

  renderJSX(component: React.ReactElement) {
    return renderToString(<JSXWrapper component={component} />);
  }

  renderPageHtml(options: PageProps): string {
    const metaDescription = options.description || '';
    const metaKeywords = options.keywords || '';
    const title = this.escapeHtml(options.title);
    const metaTags =
      Object.entries(options.meta || {})
        .map(([key, value]) => `<meta name="${key}" content="${this.escapeHtml(value)}">`)
        .join('\n') || '';
    const styles = options.styles?.map((style) => `<link rel="stylesheet" href="${style}">`).join('\n') || '';
    const scripts = options.scripts?.map((script) => `<script src="${script}"></script>`).join('\n') || '';
    const lang = options.lang || ContentLang.ZH_CN;
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${metaKeywords}">
    <title>${title}</title>
    <link rel="shortcut icon" href="/imgs/favicon.webp" type="image/x-icon">
    <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>
    ${metaTags}
    ${styles}
    ${options.globalHeader || ''}
    ${options.header || ''}
    <script src="/locals/${lang}.js"></script>
</head>
<body>
${options.content}
${scripts}
${options.globalFooter || ''}
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
export const ErrorPage: React.FC<ErrorPageProps> = ({ title, message, ...props }) => {
  return (
    <div className="wp">
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: '#dc3545' }}>{title}</h1>
        <p>{message || '抱歉，页面加载时发生错误。'}</p>
        <a
          href="/"
          style={{ color: '#007bff' }}
        >
          返回首页
        </a>
      </div>
    </div>
  );
};

// JSX包装器组件 - 用于直接渲染传入的JSX组件
export const JSXWrapper: React.FC<{ component: React.ReactElement }> = ({ component }) => {
  return component;
};
