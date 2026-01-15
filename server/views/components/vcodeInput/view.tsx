import { useSSRContext } from '@/views/hooks';
import ImgCodeInput from '../imgcodeInput/view';

interface VCodeInputProps {
  placeholder?: string;
  name?: string;
  hashName?: string;
  type?: string;
}
export default function VCodeInput({ placeholder, name = 'code', type = 'user_client_phone_login' }: VCodeInputProps) {
  const { t } = useSSRContext();
  return (
    <>
      <div
        className="v-code-input"
        data-type={type}
      >
        <input
          className="input"
          required
          type="text"
          name={name}
          placeholder={placeholder || t('请输入')}
        />
        <button
          type="button"
          className="code-btn btn"
        >
          {t('获取验证码')}
        </button>
      </div>
      <ImgCodeInput className="v-code-input-img-code" />
    </>
  );
}
