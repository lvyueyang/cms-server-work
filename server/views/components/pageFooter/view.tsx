import { useSSRContext } from '../../hooks';

export function Footer() {
  const { t, globalData } = useSSRContext();
  return (
    <footer className="footer">
      <div className="footer-content wp">
        <div className="footer-bottom">
          <div className="copyright-left">© {t('Copyright 2023-2025 xxxxx.版权所有.')}</div>
          <div className="copyright-center">
            <span>© {globalData.company_address}</span>
            <img
              src="/imgs/icon-beian-logo.png"
              alt=""
              className="icon-police"
            />
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
              className="beian-link"
            >
              {t('xxxxxxx')}
            </a>
          </div>
          <div className="footer-policies">
            <a href="/article/cookie-policy">{t('Cookie 政策')}</a>
            <span className="separator">|</span>
            <a href="/article/privacy-policy">{t('隐私政策')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
