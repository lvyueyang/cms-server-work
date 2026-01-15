import { Caution, CheckOne, CloseOne } from '@icon-park/react';
import { useEffect, useState } from 'react';
import { useSSRContext } from '@/views/hooks';

export interface ResultPageProps {
  status?: 'success' | 'error' | 'warning';
  title?: string;
  description?: string;
  type?: 'user_register' | 'back' | 'user_login';
}

export function ResultPage(props: ResultPageProps) {
  const { t } = useSSRContext();
  const [state, setState] = useState({
    status: props.status,
    title: props.title,
    description: props.description,
    type: props.type,
  });

  useEffect(() => {
    // Client-side fallback to read from URL if props are empty or if we want to support direct access
    // However, if props are provided by SSR, we stick with them unless they are empty.
    if (!props.status && !props.title) {
      const params = new URLSearchParams(window.location.search);
      const urlStatus = params.get('status');
      const urlTitle = params.get('title');
      const urlDesc = params.get('description');

      if (urlStatus || urlTitle) {
        setState({
          status: (urlStatus as any) || 'success',
          title: urlTitle || '',
          description: urlDesc || '',
          type: props.type,
        });
      }
    }
  }, [props.status, props.title]);

  const renderIcon = () => {
    switch (state.status) {
      case 'success':
        return (
          <CheckOne
            theme="filled"
            size="72"
            fill="#52c41a"
          />
        );
      case 'error':
        return (
          <CloseOne
            theme="filled"
            size="72"
            fill="#ff4d4f"
          />
        );
      case 'warning':
        return (
          <Caution
            theme="filled"
            size="72"
            fill="#faad14"
          />
        );
      default:
        return (
          <CheckOne
            theme="filled"
            size="72"
            fill="#52c41a"
          />
        );
    }
  };

  return (
    <div className="result-page">
      <div className="result-content">
        <div className="icon-box">{renderIcon()}</div>
        <h1 className="title">{t(state.title || '')}</h1>
        <p className="description">{t(state.description || '')}</p>
        <div className="actions">
          {!state.type && (
            <a
              href="/"
              className="btn"
            >
              {t('返回首页')}
            </a>
          )}
          {state.type === 'user_register' && (
            <a
              href="/register"
              className="btn"
            >
              {t('去注册')}
            </a>
          )}
          {state.type === 'back' && (
            <a
              href="javascript:history.back()"
              className="btn"
            >
              {t('返回')}
            </a>
          )}
          {state.type === 'user_login' && (
            <a
              href="/login"
              className="btn"
            >
              {t('去登录')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function createResultPageUrl(props: ResultPageProps) {
  const searchParams = new URLSearchParams({
    status: props.status || '',
    title: props.title || '',
    description: props.description || '',
    type: props.type || '',
  });
  return `/result-page?${searchParams.toString()}`;
}
