import { UserAdminInfo } from '@/interface/serverApi';
import { createContext } from 'react';

interface Options {
  data?: UserAdminInfo;
  loadInfo?: () => void;
}

const UserInfoContext = createContext<Options>({});

export default UserInfoContext;
