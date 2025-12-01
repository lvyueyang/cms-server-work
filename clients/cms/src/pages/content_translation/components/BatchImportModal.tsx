import { Upload, Modal, Form, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { batchUpsertTranslationsApi } from '../module';
import styles from '../index.module.less';

const { TextArea } = Input;

const importJsonExample = `请输入JSON格式的翻译数据，例如：
[
  {
    "entity": "news",
    "entityId": 1,
    "field": "title",
    "lang": "en-US",
    "value": "News Title"
  },
  {
    "entity": "news", 
    "entityId": 1,
    "field": "content",
    "lang": "en-US",
    "value": "News Content"
  }
]`;

interface BatchImportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [importData, setImportData] = useState('');

  const handleImportSubmit = async () => {
    try {
      if (!importData.trim()) {
        message.error('请输入JSON数据');
        return;
      }

      const translations = JSON.parse(importData);
      if (!Array.isArray(translations)) {
        message.error('JSON数据必须是数组格式');
        return;
      }

      // 验证数据格式
      for (const item of translations) {
        if (!item.entity || !item.entityId || !item.field || !item.lang) {
          console.log(item);
          message.error('翻译数据缺少必要字段');
          return;
        }
      }

      await batchUpsertTranslationsApi({ translations });
      message.success('批量导入成功');
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error('JSON格式错误，请检查输入');
      } else {
        message.error('导入失败：' + (error as Error).message);
      }
    }
  };

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
    return false; // 阻止自动上传
  };

  return (
    <Modal
      title="批量导入翻译"
      open={visible}
      onOk={handleImportSubmit}
      onCancel={onClose}
      width={800}
      okText="导入"
      cancelText="取消"
      className={styles.importModal}
    >
      <Upload.Dragger accept=".json" showUploadList={false} beforeUpload={handleFileUpload}>
        <div>
          <UploadOutlined />
          选择JSON文件
        </div>
        <div style={{ marginTop: 8, color: '#666' }}>支持上传JSON文件或直接输入JSON数据</div>
      </Upload.Dragger>
      <br />
      <Form.Item label="JSON数据" required layout="vertical">
        <TextArea
          rows={18}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          className={styles.importTextArea}
          placeholder={importJsonExample}
        />
      </Form.Item>
      <div className={styles.jsonExample}>
        <strong>数据格式说明：</strong>
        <div>• entity: 实体名（如 news, product）</div>
        <div>• entityId: 实体记录ID</div>
        <div>• field: 字段名（如 title, content）</div>
        <div>• lang: 语言代码（如 en-US, zh-CN）</div>
        <div>• value: 翻译值</div>
      </div>
    </Modal>
  );
};
