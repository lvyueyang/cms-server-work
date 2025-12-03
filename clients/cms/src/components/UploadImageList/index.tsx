import { uploadFile } from '@/services';
import { fileToUrl } from '@/utils';
import { message } from '@/utils/notice';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

interface UploadImageListProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function UploadImageList({ value, onChange }: UploadImageListProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handlerRemove = async (file: UploadFile) => {
    const newList = fileList.filter((f) => f.url !== file.url);
    setFileList(newList);
    onChange?.(newList.map((n) => n.url || ''));
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    if (file.response) {
      onChange?.(newFileList.map((item) => item.url || item.response));
    }
    setFileList(newFileList);
  };

  useEffect(() => {
    if (value) {
      setFileList(
        value.map((url) => ({
          name: 'image.png',
          status: 'done',
          uid: url,
          url,
        })),
      );
    }
  }, [value]);

  return (
    <>
      <Upload
        listType="picture-card"
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handlerRemove}
        fileList={fileList}
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
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
