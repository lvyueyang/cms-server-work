import { uploadFile } from '@/services';
import { message } from '@/utils/message';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadProps } from 'antd';
interface UploadImageProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function UploadFile({ value, onChange }: UploadImageProps) {
  const changeHandler: UploadProps<string>['onChange'] = (e) => {
    if (e.file.response) {
      onChange?.(e.file.response);
    }
  };
  return (
    <Upload.Dragger
      name="file"
      maxCount={1}
      onChange={changeHandler}
      customRequest={({ file, onError, onProgress, onSuccess }) => {
        uploadFile(file as File, { onUploadProgress: onProgress })
          .then((res) => {
            onSuccess?.(res.data.data);
            message.success('上传成功');
          })
          .catch(onError);
        return {
          abort() {
            console.log('abort');
          },
        };
      }}
    >
      <div>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
        {value && (
          <a
            className="ant-upload-hint"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              margin: '0 auto',
            }}
            href={value}
            onClick={(e) => {
              e.stopPropagation();
            }}
            target="_blank"
            rel="noreferrer"
          >
            {value.split('/').reverse()[0]}{' '}
            <Button type="primary" size="small" ghost>
              点击预览
            </Button>
          </a>
        )}
      </div>
    </Upload.Dragger>
  );
}
