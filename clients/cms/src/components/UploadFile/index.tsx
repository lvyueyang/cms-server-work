import { openSelectFile } from '@/pages/file-manage/module/select';
import { uploadFile } from '@/services';
import { fileToUrl } from '@/utils';
import { message } from '@/utils/notice';
import { DownOutlined, FolderFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Space, Upload, UploadProps, UploadFile as AntUploadFile, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

interface UploadFileProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function UploadFile({ value, onChange }: UploadFileProps) {
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

interface UploadFileListProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}
export function UploadFileList({ value, onChange }: UploadFileListProps) {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);

  useEffect(() => {
    const val = value || [];
    setFileList((prev) => {
      const activeFiles = prev.filter((f) => f.status && f.status !== 'done');
      const doneFiles = val.map((url, index) => {
        const existing = prev.find(
          (f) => (f.response === url || f.url === url) && f.status === 'done',
        );
        if (existing) {
          return existing;
        }
        return {
          uid: `history-${index}-${url}`,
          name: url.split('/').pop() || 'unknown',
          status: 'done',
          url: url,
          response: url,
        } as AntUploadFile;
      });
      return [...activeFiles, ...doneFiles];
    });
  }, [JSON.stringify(value)]);

  const handleChange = ({ fileList: newFileList }: { fileList: AntUploadFile[] }) => {
    setFileList(newFileList);
    const successUrls = newFileList
      .filter((f) => f.status === 'done' && f.response)
      .map((f) => f.response as string);
    onChange?.(successUrls);
  };

  return (
    <Upload
      name="file"
      fileList={fileList}
      onChange={(values) => {
        handleChange(values);
      }}
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
      <Space.Compact>
        <Button icon={<UploadOutlined />} type="primary" ghost>
          上传文件
        </Button>
        <Tooltip title="选择文件">
          <Button
            type="primary"
            icon={<FolderFilled />}
            onClick={(e) => {
              e.stopPropagation();
              openSelectFile({
                multiple: true,
              }).then((res) => {
                console.log('res: ', res);
                const doneFiles = res.map(
                  (file, index) =>
                    ({
                      uid: `select-${index}-${file.id}`,
                      name: file.name || 'unknown',
                      status: 'done',
                      url: fileToUrl(file, true),
                      response: fileToUrl(file),
                    }) satisfies AntUploadFile,
                );
                handleChange({ fileList: [...fileList, ...doneFiles] });
              });
            }}
          ></Button>
        </Tooltip>
      </Space.Compact>
    </Upload>
  );
}
