import { useSSRContext } from '@/views/hooks';

export function NotFoundPage() {
  const { t } = useSSRContext();
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#dc3545', fontSize: 50 }}>404</h1>
      <p>{t('抱歉，您访问的页面不存在。')}</p>
      <a href="/" style={{ color: '#007bff' }}>
        {t('返回首页')}
      </a>
    </div>
  );
}
