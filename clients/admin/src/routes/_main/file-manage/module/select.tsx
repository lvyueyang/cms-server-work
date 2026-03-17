import { modal } from '@/utils/notice';
import { FileManageInfo } from '@cms/api-interface';
import { getListApi } from './services';
import React, { useEffect, useState } from 'react';
import { Input, Pagination, Spin, Empty, Image } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';

interface SelectFileOptions {
  keyword?: string;
  multiple?: boolean;
  onSelect?: (file: FileManageInfo[]) => void;
}

const FileSelector: React.FC<{
  multiple?: boolean;
  defaultKeyword?: string;
  onSelect: (files: FileManageInfo[]) => void;
}> = ({ multiple, defaultKeyword, onSelect }) => {
  const [list, setList] = useState<FileManageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState(defaultKeyword || '');
  const [selectedFiles, setSelectedFiles] = useState<FileManageInfo[]>([]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getListApi({
        current,
        page_size: pageSize,
        keyword,
      });
      setList(res.data.data.list);
      setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [current, pageSize, keyword]);

  useEffect(() => {
    onSelect(selectedFiles);
  }, [selectedFiles]);

  const handleSelect = (file: FileManageInfo) => {
    if (multiple) {
      const exists = selectedFiles.find((f) => f.id === file.id);
      if (exists) {
        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } else {
      setSelectedFiles([file]);
    }
  };

  const isSelected = (id: string) => selectedFiles.some((f) => f.id === id);

  return (
    <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginTop: '10px' }}>
        <Input.Search
          placeholder="搜索文件名称"
          onSearch={(val) => {
            setKeyword(val);
            setCurrent(1);
          }}
          enterButton
          allowClear
          style={{ maxWidth: 300 }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <Spin />
          </div>
        ) : list.length === 0 ? (
          <Empty description="暂无文件" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px',
            }}
          >
            {list.map((file) => (
              <CheckCard
                key={file.id}
                checked={isSelected(file.id)}
                onChange={() => handleSelect(file)}
                style={{ width: '100%' }}
                bodyStyle={{ padding: '8px' }}
                cover={
                  <>
                    <div
                      style={{
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {file.type?.startsWith('image') ? (
                        <Image
                          src={`/getfile/${file.id}`}
                          alt={file.name}
                          styles={{
                            image: {
                              maxWidth: '100%',
                              maxHeight: '100px',
                              objectFit: 'contain',
                            },
                          }}
                          preview
                        />
                      ) : (
                        <FileOutlined style={{ fontSize: '32px', color: '#999' }} />
                      )}
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        paddingTop: '8px',
                      }}
                    >
                      {file.name}
                    </div>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right' }}>
        <Pagination
          size="small"
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            setCurrent(page);
            setPageSize(size);
          }}
          showTotal={(t) => `共 ${t} 项`}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export function openSelectFile(opt: SelectFileOptions): Promise<FileManageInfo[]> {
  let selected: FileManageInfo[] = [];

  return new Promise((resolve, reject) => {
    modal.info({
      title: opt.multiple ? '选择文件 (多选)' : '选择文件',
      width: 900,
      icon: null,
      centered: true,
      content: (
        <FileSelector
          multiple={opt.multiple}
          defaultKeyword={opt.keyword}
          onSelect={(files) => {
            selected = files;
          }}
        />
      ),
      okText: '确定',
      closable: true,
      maskClosable: true,
      okType: 'primary',
      onOk: () => {
        resolve(selected);
      },
      onCancel: () => {
        reject();
      },
    });
  });
}
