import { Input } from 'antd';
import { ContentType } from '@/constants';
import CodeEditor from '../CodeEditor';
import Editor from '../Editor';
import { LowCodeEditor } from '../LowcodeEditor';
import UploadFile from '../UploadFile';
import UploadImage from '../UploadImage';

interface AutoContentInputProps {
  type: ContentType;
  value?: string;
  onChange?: (value: string) => void;
}

export function AutoContentInput({ type = ContentType.TEXT, value, onChange }: AutoContentInputProps) {
  switch (type) {
    case ContentType.INPUT:
      return (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    case ContentType.Code:
      return (
        <CodeEditor
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    case ContentType.Json:
      return (
        <CodeEditor
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    case ContentType.Rich:
      return (
        <Editor
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    case ContentType.LowCode:
      return (
        <LowCodeEditor
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    case ContentType.IMAGE:
      return (
        <UploadImage
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    case ContentType.FILE:
      return (
        <UploadFile
          value={value}
          onChange={(e) => onChange?.(e)}
        />
      );
    default:
      return (
        <Input.TextArea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
  }
}
