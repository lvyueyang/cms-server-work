import type { Pagination } from '@/interface';

/** 分页查询参数转换 */
export function paginationTransform(pagination: Pagination) {
  const current = Number(pagination.current);
  const page_size = Number(pagination.page_size);
  return {
    skip: (current - 1) * page_size,
    take: page_size,
  };
}
