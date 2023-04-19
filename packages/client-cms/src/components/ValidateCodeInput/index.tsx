import { SEND_TYPE_ENUM, SEND_VALIDATE_CODE_TYPE, SEND_VALIDATE_CODE_TYPE_ENUM } from '@/constants';
import { sendEmailCode, sendSmsCode } from '@/services';
import { Button, Input, InputProps, Space } from 'antd';
import { useRef, useState } from 'react';

const DEF_TEST = '发送验证码';

interface SendButtonProps {
  targetValue: string;
  sendType: SEND_VALIDATE_CODE_TYPE_ENUM;
  actionType?: SEND_TYPE_ENUM;
}
export function SendButton({ targetValue, sendType }: SendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState(DEF_TEST);
  const timer = useRef(0);

  const looperTimer = () => {
    if (timer.current === 0) {
      setText(DEF_TEST);
      setDisabled(false);
      return;
    }
    setTimeout(() => {
      timer.current -= 1;
      const newText = `${timer.current}s 后重新发送`;
      setText(newText);

      looperTimer();
    }, 1000);
  };

  const submitHandler = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setText('发送中 ...');
      if (sendType === SEND_VALIDATE_CODE_TYPE.SMS.id) {
        await sendSmsCode(targetValue);
      }
      if (sendType === SEND_VALIDATE_CODE_TYPE.EMAIL.id) {
        await sendEmailCode(targetValue);
      }
      timer.current = 60;
      setDisabled(true);
      looperTimer();
    } catch (e) {
      setText(DEF_TEST);
    }
    setLoading(false);
  };

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={submitHandler}
      disabled={!targetValue || disabled}
      formNoValidate
    >
      {text}
    </Button>
  );
}

export interface ValidateCodeInputProps extends SendButtonProps, InputProps {}

export default function ValidateCodeInput({
  sendType,
  targetValue,
  placeholder = '请输入验证码',
  actionType,
  ...props
}: ValidateCodeInputProps) {
  return (
    <Space>
      <Input type="text" placeholder={placeholder} {...props} />
      <SendButton targetValue={targetValue} sendType={sendType} actionType={actionType} />
    </Space>
  );
}
