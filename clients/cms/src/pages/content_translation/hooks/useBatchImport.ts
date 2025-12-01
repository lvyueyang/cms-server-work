import { useState } from 'react';
import { batchUpsertTranslationsApi } from '../module';
import { message } from 'antd';

export interface UseBatchImportOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface BatchImportState {
  importData: string;
  isImporting: boolean;
}

export const useBatchImport = (options: UseBatchImportOptions = {}) => {
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const validateTranslations = (translations: any[]): boolean => {
    if (!Array.isArray(translations)) {
      message.error('JSON数据必须是数组格式');
      return false;
    }

    for (const item of translations) {
      if (!item.entity || !item.entityId || !item.field || !item.lang) {
        console.log(item);
        message.error('翻译数据缺少必要字段');
        return false;
      }
    }

    return true;
  };

  const handleImportSubmit = async () => {
    try {
      if (!importData.trim()) {
        message.error('请输入JSON数据');
        return false;
      }

      const translations = JSON.parse(importData);

      if (!validateTranslations(translations)) {
        return false;
      }

      setIsImporting(true);
      await batchUpsertTranslationsApi({ translations });
      message.success('批量导入成功');

      if (options.onSuccess) {
        options.onSuccess();
      }

      return true;
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error('JSON格式错误，请检查输入');
      } else {
        message.error('导入失败：' + (error as Error).message);
      }

      if (options.onError) {
        options.onError(error as Error);
      }

      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (file: File): boolean => {
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

  const resetImportData = () => {
    setImportData('');
  };

  return {
    importData,
    setImportData,
    isImporting,
    handleImportSubmit,
    handleFileUpload,
    resetImportData,
  };
};
