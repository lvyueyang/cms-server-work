import { VALIDATE_CODE_TYPE } from '@/constants';
import VCodeInput from '@/views/components/vcodeInput/view';
import { useSSRContext } from '@/views/hooks';

export function ResetPasswordPage() {
  const { t } = useSSRContext();
  return (
    <div className="wp login-page-container">
      <div className="login-box">
        <div className="login-tabs">
          <div
            className="tab active"
            data-type="password"
          >
            {t('重置密码')}
          </div>
        </div>

        <div className="login-content">
          <form
            className="login-form active"
            id="form-password"
            action="/reset-password"
            method="POST"
          >
            <div style={{ width: '0', height: '0', overflow: 'hidden' }}>
              {/* 禁用浏览器的自动输入账号密码 */}
              <input type="password" />
            </div>
            <div className="form-item">
              <input
                type="tel"
                name="phone"
                autoComplete="false"
                placeholder={t('请输入手机号')}
                className="input"
              />
            </div>
            <div className="form-item">
              <input
                type="password"
                name="password"
                placeholder={t('请输入密码')}
                className="input"
                autoComplete="false"
              />
            </div>
            <div className="form-item">
              <input
                type="password"
                name="confirm-password"
                placeholder={t('确认密码')}
                className="input"
              />
            </div>
            <div className="form-item">
              <VCodeInput type={VALIDATE_CODE_TYPE.USER_CLIENT_FORGET_PASSWORD} />
            </div>
            <button
              type="submit"
              className="submit-btn btn btn-block"
            >
              {t('重置密码')}
            </button>
          </form>

          <div className="bottom-links">
            <a href="/login">{t('去登录')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
