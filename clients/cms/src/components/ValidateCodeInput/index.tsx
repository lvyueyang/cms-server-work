import { Button, Flex, Input, InputProps } from 'antd';
import { useRef, useState } from 'react';

const DEF_TEST = '发送验证码';

interface SendButtonProps {
  targetValue: string;
  sendRequest: () => Promise<unknown>;
}
export function SendButton({ targetValue, sendRequest }: SendButtonProps) {
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
      await sendRequest?.();
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
  targetValue,
  placeholder = '请输入验证码',
  sendRequest,
  ...props
}: ValidateCodeInputProps) {
  return (
    <Flex gap={16}>
      <Input type="text" placeholder={placeholder} {...props} />
      <SendButton targetValue={targetValue} sendRequest={sendRequest} />
    </Flex>
  );
}
