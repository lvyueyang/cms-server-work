import { ContentType, ContentTypeMap } from '@/constants';
import { message } from '@/utils/notice';
import { ProSchemaValueEnumType } from '@ant-design/pro-components';
import { FileManageInfo } from '@cms/api-interface';
import { SortOrder } from 'antd/es/table/interface';
import { AxiosResponse } from 'axios';
export * from './i18n';
interface TransformPaginationOption {
  current?: number;
  pageSize?: number;
}
/** antd-pro-table 分页参数格式化 */
export function transformPagination({ current, pageSize }: TransformPaginationOption) {
  return {
    current: current || 1,
    page_size: pageSize || 10,
  };
}

/** 复制文字 */
export const copyText = (text: string) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window.navigator.clipboard?.writeText === 'function') {
        window.navigator.clipboard.writeText(text).then(resolve).catch(reject);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.select();
        document.execCommand('Copy');
        resolve(true);
      }
    } catch (e) {
      message.error('复制失败');
      reject(e);
    }
  });
};

export function downloadFile(url: string, name?: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name || url.split('/').reverse()[0];
  a.target = '_blank';
  a.click();
  a.remove();
}

export function isJson(value: string) {
  try {
    const obj = JSON.parse(value);
    if (typeof obj === 'object' && !!obj) {
      return obj;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/** 格式化文件大小 */
export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** 合并 className */
export function cls(...classList: (string | undefined | boolean)[]) {
  return classList.filter((i) => !!i).join(' ');
}

const ORDER_ENUM = {
  descend: 'DESC',
  ascend: 'ASC',
};

export function transformSort(sort: { [key: string]: SortOrder }) {
  const res = Object.entries(sort).map(([key, value]) => {
    if (!value) return {};
    return {
      order_key: key,
      order_type: ORDER_ENUM[value],
    };
  });

  return res[0];
}

export function fileToUrl(file: FileManageInfo | string, useName?: boolean) {
  const prefix = useName ? 'getfilebyname' : 'getfile';
  if (typeof file === 'string') {
    return `/${prefix}/${file}`;
  }
  return `/${prefix}/${useName ? file.name : file.id}`;
}

export function enumMapToOptions<T extends string>(enumMap: Map<T, { label: string; value?: T }>) {
  const options = [];
  for (const [key, item] of enumMap.entries()) {
    options.push({
      label: item.label,
      value: key || item.value,
    });
  }
  return options;
}

export function enumMapToTableEnum<T extends string>(
  enumMap: Map<
    T,
    { label: string; value?: T; status?: string; color?: string; disabled?: boolean }
  >,
) {
  const options: Record<string, ProSchemaValueEnumType> = {};
  for (const [key, item] of enumMap.entries()) {
    if (key || item.value) {
      options[key || item.value || ''] = {
        text: item.label,
        status: item.status,
        color: item.color,
        disabled: item.disabled,
      };
    }
  }
  return options;
}

export function contentType2Label(type: string) {
  return ContentTypeMap.get(type as ContentType)?.label || type;
}

export function downloadResponseFile(res: AxiosResponse<unknown, any>) {
  const [, fileName] = res.headers['content-disposition'].split('filename=');
  const blob = new Blob([res.data as any]);
  let dom = document.createElement('a');
  let url = window.URL.createObjectURL(blob);
  dom.href = url;
  dom.target = '_blank';
  dom.download = decodeURIComponent(fileName);
  dom.click();
  window.URL.revokeObjectURL(url);
}
