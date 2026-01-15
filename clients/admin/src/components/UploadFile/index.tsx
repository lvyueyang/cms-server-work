import { FolderFilled, UploadOutlined } from '@ant-design/icons';
import { UploadFile as AntUploadFile, Button, Space, Tooltip, Upload, UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { openSelectFile } from '@/pages/file-manage/module/select';
import { uploadFile } from '@/services';
import { fileToUrl } from '@/utils';
import { message } from '@/utils/notice';

interface UploadFileProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (files: { url: string; name: string; size: number; type: string }) => void;
}
export default function UploadFile({ value, onChange, onSelect }: UploadFileProps) {
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
            const url = fileToUrl(data);
            onSuccess?.(url);
            message.success('上传成功');
            onSelect?.({
              url,
              name: data.name,
              size: data.size,
              type: data.type,
            });
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
        <p className="ant-upload-text">单击或拖动文件到此区域以上传或</p>
        <div>
          <Button
            type="primary"
            ghost
            onClick={(e) => {
              e.stopPropagation();
              openSelectFile({ multiple: false }).then(([file]) => {
                const url = fileToUrl(file.id);
                onChange?.(url);
                onSelect?.({
                  url,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                });
              });
            }}
          >
            选择文件
          </Button>
        </div>
        {value && (
          <a
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '260px',
              margin: '10px auto 0',
              display: 'flex',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value.split('/').reverse()[0]}{' '}
            </div>
            <Button
              type="primary"
              size="small"
              ghost
              onClick={(e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = value;
                a.target = '_blank';
                a.rel = 'noreferrer';
                a.click();
                a.remove();
              }}
            >
              点击预览
            </Button>
            <Button
              type="primary"
              size="small"
              ghost
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/file-manage?keyword=${value.split('/').pop()}`);
              }}
            >
              管理文件
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
  onSelect?: (files: any[]) => void;
}
export function UploadFileList({ value, onChange, onSelect }: UploadFileListProps) {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);

  useEffect(() => {
    const val = value || [];
    setFileList((prev) => {
      const activeFiles = prev.filter((f) => f.status && f.status !== 'done');
      const doneFiles = val.map((url, index) => {
        const existing = prev.find((f) => (f.response === url || f.url === url) && f.status === 'done');
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
    const successUrls = newFileList.filter((f) => f.status === 'done' && f.response).map((f) => f.response as string);
    onChange?.(successUrls);
    onSelect?.(newFileList);
  };

  return (
    <Upload
      name="file"
      multiple={true}
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
        <Button
          icon={<UploadOutlined />}
          type="primary"
          ghost
        >
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
                const doneFiles = res.map(
                  (file, index) =>
                    ({
                      uid: `select-${index}-${file.id}`,
                      name: file.name || 'unknown',
                      status: 'done',
                      url: fileToUrl(file, true),
                      response: fileToUrl(file),
                    } satisfies AntUploadFile)
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
