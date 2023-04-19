import UserInfoContext from '@/context/UserInfo';
import { useContext } from 'react';

export default function useUserInfo() {
  const user = useContext(UserInfoContext);

  return {
    userInfo: user.data,
    loadUser: user.loadInfo,
  };
}
