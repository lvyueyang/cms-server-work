import { StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import type { ObjectLiteral, Repository } from 'typeorm';
import { utils, write } from 'xlsx';
import { ExportFileType } from '@/constants';

interface HeaderItem {
  key: string;
  title?: string;
}
interface DataSourceToExcelOptions {
  dataList: Record<string, any>[];
  headers: HeaderItem[];
}

export function dataSourceToExcel({ dataList, headers }: DataSourceToExcelOptions) {
  // 按 entity 分组
  const entityGroups = new Map<string, typeof dataList>();
  dataList.forEach((item) => {
    const group = entityGroups.get(item.entity) || [];
    group.push(item);
    entityGroups.set(item.entity, group);
  });
  const sheets: string[][] = [
    headers.map((h) => {
      if (h.title) {
        return `${h.title}(${h.key})`;
      }
      return h.key;
    }),
  ];
  for (const item of dataList) {
    const row: string[] = [];
    for (const h of headers) {
      if (Array.isArray(item[h.key])) {
        row.push(item[h.key].join(','));
      } else {
        row.push(item[h.key] || '');
      }
    }
    sheets.push(row);
  }

  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet(sheets);
  utils.book_append_sheet(wb, ws, 'Sheet1');
  const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

export function exportData<E extends ObjectLiteral>({
  dataList,
  exportType,
  name,
  repository,
}: {
  dataList: DataSourceToExcelOptions['dataList'];
  exportType?: ExportFileType;
  name: string;
  repository: Repository<E>;
}) {
  const type = exportType || ExportFileType.XLSX;
  const fileName = `${name}-${dayjs().format('YYYY-MM-DDTHHmmss')}`;
  const encodedFileName = encodeURIComponent(fileName);

  if (type === 'json') {
    return new StreamableFile(new Uint8Array(Buffer.from(JSON.stringify(dataList, null, 2))), {
      type: 'application/json',
      disposition: `attachment;filename=${encodedFileName}.json`,
    });
  }
  const headers = repository.metadata.columns.map((col) => {
    return {
      key: col.propertyName,
      title: col.comment,
    };
  });
  const buffer = dataSourceToExcel({ dataList, headers });
  return new StreamableFile(new Uint8Array(buffer), {
    type: 'application/octet-stream',
    disposition: `attachment;filename=${encodedFileName}.xlsx`,
  });
}
