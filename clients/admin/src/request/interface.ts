export interface Pagination {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  page_size: number;
}

export interface Result<T> {
  code: number;
  data: T;
  msg: string;
}

export type ListResult<T> = Result<{
  /** 当前页码 */
  page: number;
  /** 总条数 */
  total: number;
  /** 列表数据 */
  list: T[];
}>;
