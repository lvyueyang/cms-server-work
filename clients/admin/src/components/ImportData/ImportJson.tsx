import { UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, ModalProps, message, Upload } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { modal } from '@/utils/notice';
import CodeEditor from '../CodeEditor';
import styles from './index.module.less';

interface ImportJsonProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: ReactNode;
}
export function ImportJson({ value, onChange, help, placeholder = '请输入JSON数据' }: ImportJsonProps) {
  const [importData, setImportData] = useState(value);
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setImportData(content);
        message.success('文件读取成功');
      } catch (error) {
        message.error('文件读取失败');
      }
    };
    reader.readAsText(file);
    return false;
  };
  useEffect(() => {
    if (importData !== value) {
      setImportData(importData);
    }
  }, [value]);
  useEffect(() => {
    if (importData !== value) {
      onChange(importData);
    }
  }, [importData]);
  return (
    <div>
      <Upload.Dragger
        accept=".json"
        showUploadList={false}
        beforeUpload={handleFileUpload}
      >
        <div>
          <UploadOutlined />
          选择JSON文件
        </div>
        <div style={{ marginTop: 8, color: '#666' }}>支持上传JSON文件或直接输入JSON数据</div>
      </Upload.Dragger>
      <br />
      <Form.Item
        label="JSON数据"
        required
        layout="vertical"
      >
        <CodeEditor
          style={{ height: 400 }}
          value={importData}
          onChange={setImportData}
        />
      </Form.Item>
      <div className={styles.jsonExample}>{help}</div>
    </div>
  );
}

interface ImportJsonModalProps extends ModalProps {
  placeholder?: string;
  help?: ReactNode;
}

export function ImportJsonModal(props: ImportJsonModalProps) {
  const [importData, setImportData] = useState('');
  return (
    <Modal {...props}>
      <ImportJson
        value={importData}
        onChange={setImportData}
        placeholder="请输入JSON数据"
        help="支持上传JSON文件或直接输入JSON数据"
      />
    </Modal>
  );
}

// 函数式调用
export function openImportJsonModal({ onOk, help }: { onOk: (importData: string) => Promise<void>; help?: ReactNode }) {
  let importData = '';
  const m = modal.info({
    title: '导入JSON数据',
    icon: null,
    width: 900,
    style: {
      top: 15,
    },
    styles: {
      body: {
        ['--ant-margin-sm']: '0px',
      } as any,
    },
    maskClosable: false,
    keyboard: false,
    content: (
      <>
        <div style={{ height: 15 }}></div>
        <ImportJson
          value={importData}
          onChange={(value) => {
            importData = value;
          }}
          help={help || '支持上传JSON文件或直接输入JSON数据'}
          placeholder="请输入JSON数据"
        />
      </>
    ),
    footer: (
      <Flex
        justify="flex-end"
        gap="16px 16px"
        style={{ marginTop: 24 }}
      >
        <Button onClick={() => m.destroy()}>取消</Button>
        <Button
          type="primary"
          onClick={async () => {
            if (!importData.trim()) {
              message.error('请输入JSON数据');
              return;
            }
            await onOk(importData);
            message.success('导入成功');
            m.destroy();
          }}
        >
          确定
        </Button>
      </Flex>
    ),
  });
}
