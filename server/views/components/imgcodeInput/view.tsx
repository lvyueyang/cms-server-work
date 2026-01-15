import { useSSRContext } from '@/views/hooks';

interface ImgCodeInputProps {
  className?: string;
  id?: string;
  placeholder?: string;
  name?: string;
  hashName?: string;
}
export default function ImgCodeInput({
  className,
  id,
  placeholder,
  name = 'img_code',
  hashName = 'img_code_hash',
}: ImgCodeInputProps) {
  const { t } = useSSRContext();
  return (
    <div className={`img-code-input ${className || ''}`} id={id}>
      <input
        className="input"
        required
        type="text"
        name={name}
        placeholder={placeholder || t('请输入验证码')}
      />
      <input hidden name={hashName} className="image_code_hash" />
      <div className="code-img"></div>
    </div>
  );
}
