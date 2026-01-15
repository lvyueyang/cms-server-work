import { request } from '@/request';
import { ImageValidateCodeResponseDto } from '@cms/api-interface';

export * from './user';

export const getImageCode = () => {
  return request.get<ImageValidateCodeResponseDto['data']>(`/api/image-validate-code`);
};
