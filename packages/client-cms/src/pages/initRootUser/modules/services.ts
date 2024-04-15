import { AIP_FIX } from '@/constants';
import { UserAdminCreateRootDto } from '@/interface/serverApi';

import { request } from '@/request';
import { Result } from '@/types';

export const initRootUser = (body: UserAdminCreateRootDto) => {
  return request.post<Result<number>>(`${AIP_FIX}/init-root-user-admin`, body);
};
