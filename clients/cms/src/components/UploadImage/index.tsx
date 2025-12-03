import { openSelectFile } from '@/pages/file-manage/module/select';
import { uploadFile } from '@/services';
import { fileToUrl } from '@/utils';
import { message } from '@/utils/notice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Upload, UploadProps } from 'antd';
interface UploadImageProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function UploadImage({ value, onChange }: UploadImageProps) {
  const changeHandler: UploadProps<string>['onChange'] = (e) => {
    if (e.file.response) {
      onChange?.(e.file.response);
    }
  };
  return (
    <div>
      <Upload<string>
        onChange={changeHandler}
        listType="picture-card"
        showUploadList={false}
        accept="image/*"
        customRequest={({ file, onError, onProgress, onSuccess }) => {
          uploadFile(file as File, { onUploadProgress: onProgress })
            .then((res) => {
              const data = res.data.data;
              onSuccess?.(fileToUrl(data));
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
        <>
          {value ? (
            <img
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              src={`${value}`}
            />
          ) : (
            <div>
              <PlusOutlined style={{ fontSize: 30, color: '#666' }} />
            </div>
          )}
        </>
      </Upload>
      <Button
        type="primary"
        ghost
        style={{ marginTop: 10, width: '100px' }}
        onClick={(e) => {
          e.stopPropagation();
          openSelectFile({}).then(([file]) => {
            onChange?.(fileToUrl(file));
          });
        }}
      >
        选择图片
      </Button>
    </div>
  );
}
