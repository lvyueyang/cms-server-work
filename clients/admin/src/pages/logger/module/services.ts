import { AIP_FIX } from '@/constants';
import { LoggerListResponseDto } from '@cms/api-interface';
import { request } from '@/request';
import { Result } from '@/types';

export interface LoggerItem {
  context: string;
  level: string;
  message: string;
  trace: string;
}

/** 列表 */
export const getListApi = () => {
  return request.get<LoggerListResponseDto>(`${AIP_FIX}/logger`);
};

/** 详情 */
export const getDetailApi = async (date: string) => {
  const res = await request.get<Result<string[]>>(`${AIP_FIX}/logger/${date}`);
  return {
    ...res,
    data: {
      ...res.data,
      data: res.data.data
        .filter((i) => i.trim())
        .map((item) => {
          const obj = JSON.parse(item);
          return obj as LoggerItem;
        }),
    },
  };
};
