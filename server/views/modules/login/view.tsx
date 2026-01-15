import { VALIDATE_CODE_TYPE } from '@/constants';
import VCodeInput from '@/views/components/vcodeInput/view';
import { useSSRContext } from '@/views/hooks';

interface LoginPageProps {
  message?: string;
}

export function LoginPage({ message }: LoginPageProps) {
  const { t } = useSSRContext();
  return (
    <div className="wp login-page-container">
      {message && <div className="login-message">{t(message)}</div>}
      <div className="login-box">
        <div className="login-tabs">
          <div
            className="tab active"
            data-type="password"
          >
            {t('密码登录')}
          </div>
          <div
            className="tab"
            data-type="sms"
          >
            {t('验证码登录')}
          </div>
        </div>

        <div className="login-content">
          {/* Password Login Form */}
          <form
            className="login-form active"
            id="form-password"
            action="/login/password"
            method="POST"
          >
            <div className="form-item">
              <input
                type="tel"
                name="phone"
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
              />
            </div>
            <input
              name="redirect_uri"
              hidden
            />
            <button
              type="submit"
              className="submit-btn btn btn-block"
            >
              {t('登录')}
            </button>
          </form>

          {/* SMS Login Form */}
          <form
            className="login-form"
            id="form-sms"
            action="/login/code"
            method="POST"
          >
            <input
              name="redirect_uri"
              hidden
            />
            <div className="form-item">
              <input
                type="tel"
                name="phone"
                placeholder={t('请输入手机号')}
                className="input"
              />
            </div>
            <div className="form-item">
              <VCodeInput type={VALIDATE_CODE_TYPE.USER_CLIENT_PHONE_LOGIN} />
            </div>
            <button
              type="submit"
              className="submit-btn btn btn-block"
            >
              {t('登录')}
            </button>
          </form>

          <div className="bottom-links">
            <a href="/reset-password">{t('忘记密码')}</a>
            <a href="/register">{t('用户注册')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function createLoginPageUrl({
  redirect_uri,
  message,
}: {
  redirect_uri?: string;
  message?: string;
} = {}) {
  const searchParams = new URLSearchParams({
    redirect_uri: redirect_uri || '',
    message: message || '',
  });
  return `/login?${searchParams.toString()}`;
}
