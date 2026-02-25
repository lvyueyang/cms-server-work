import { useRequest } from 'ahooks';
import { Button, Card, Collapse, Empty, Segmented, Space, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { getFileContentApi, getFilesApi, getDownloadUrl } from './module';
import { DownloadOutlined } from '@ant-design/icons';

interface DetailProps {
  date: string;
}

export default function LoggerDetail({ date }: DetailProps) {
  const [currentFile, setCurrentFile] = useState<string>('');

  const { data: files = [], loading: filesLoading } = useRequest(
    () => getFilesApi(date).then((res) => res.data.data),
    {
      onSuccess: (data) => {
        if (data.length > 0 && !currentFile) {
          setCurrentFile(data[0]);
        }
      },
    },
  );

  const { data: logs, run: fetchLogs, loading: logsLoading } = useRequest(
    (filename) => getFileContentApi(date, filename).then((res) => res.data.data),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (currentFile) {
      fetchLogs(currentFile);
    }
  }, [currentFile]);

  const handleDownload = () => {
    if (!currentFile) return;
    const url = getDownloadUrl(date, currentFile);
    window.open(url, '_blank');
  };

  return (
    <Card size="small" loading={filesLoading}>
      {files.length === 0 ? (
        <Empty description="暂无日志文件" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Segmented
              options={files}
              value={currentFile}
              onChange={(val) => setCurrentFile(val as string)}
            />
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
              disabled={!currentFile}
            >
              下载日志
            </Button>
          </div>

          <Card loading={logsLoading} bordered={false} bodyStyle={{ padding: 0 }}>
            {!logs?.length ? (
              <Empty description="文件内容为空" />
            ) : (
              <Collapse>
                {logs?.map((item, index) => {
                  return (
                    <Collapse.Panel
                      header={
                        <Space>
                          {item.level && (
                            <Tag color={item.level === 'error' ? 'red' : item.level === 'warn' ? 'orange' : 'blue'}>
                              {item.level?.toUpperCase()}
                            </Tag>
                          )}
                          {item.context && <Tag>{item.context}</Tag>}
                          <span>{item.message}</span>
                        </Space>
                      }
                      key={index}
                    >
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                        {item.trace || JSON.stringify(item, null, 2)}
                      </pre>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            )}
          </Card>
        </Space>
      )}
    </Card>
  );
}
