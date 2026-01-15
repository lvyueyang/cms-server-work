import { Button, Flex, Input, InputProps, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { message } from '@/utils/notice';
import { ImageCode } from '../ImageCode';

const DEF_TEST = '发送验证码';

interface SendButtonProps {
  targetValue: string;
  sendRequest: (params: { code: string; hash: string }) => Promise<unknown>;
}
export function SendButton({ targetValue, sendRequest }: SendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState(DEF_TEST);
  const [open, setOpen] = useState(false);
  const [imgCode, setImgCode] = useState({
    code: '',
    hash: '',
  });
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
    console.log('imgCode: ', imgCode);
    if (!imgCode.code || !imgCode.hash) {
      message.error('请输入图片验证码');
      return;
    }
    setOpen(false);
    try {
      setLoading(true);
      setText('发送中 ...');
      await sendRequest?.({
        code: imgCode.code,
        hash: imgCode.hash,
      });
      timer.current = 60;
      setDisabled(true);
      looperTimer();
    } catch (e) {
      setText(DEF_TEST);
    }
    setLoading(false);
  };

  useEffect(() => {
    const closePopover = () => {
      setOpen(false);
    };
    document.addEventListener('click', closePopover);
    return () => {
      document.removeEventListener('click', closePopover);
    };
  }, []);

  return (
    <Popover
      title="请输入图片验证码"
      trigger={[]}
      open={open}
      content={
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ImageCode
            value={imgCode}
            onChange={(e) => {
              setImgCode({
                code: e?.code || '',
                hash: e?.hash || '',
              });
            }}
          ></ImageCode>
          <Flex style={{ marginTop: 10 }}>
            <Button
              type="primary"
              loading={loading}
              onClick={submitHandler}
              disabled={!targetValue || disabled}
              formNoValidate
            >
              确定
            </Button>
          </Flex>
        </div>
      }
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        type="primary"
        loading={loading}
        disabled={!targetValue || disabled}
        formNoValidate
      >
        {text}
      </Button>
    </Popover>
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
    <Flex gap={8}>
      <Input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        {...props}
      />
      <SendButton
        targetValue={targetValue}
        sendRequest={sendRequest}
      />
    </Flex>
  );
}
