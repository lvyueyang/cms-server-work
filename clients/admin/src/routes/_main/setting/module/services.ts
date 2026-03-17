import { request, AIP_FIX, Result } from '@/request';

/** 列表 */
export const initRenderViewGlobalDataApi = () => {
  return request.post<Result<null>>(`${AIP_FIX}/init_render_view_global_data`);
};
