import UserInfoContext from '@/context/UserInfo';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { UserAdminInfo } from '@/interface/serverApi';
import { getUserInfo } from '@/services';
import { useEffect, useState } from 'react';
import { Outlet } from 'umi';

export default function DefaultLayout() {
  const [userInfo, setUserInfo] = useState<UserAdminInfo>();
  const loadUserInfo = () => {
    getUserInfo().then(({ data }) => {
      setUserInfo(data.data);
    });
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <UserInfoContext.Provider value={{ data: userInfo, loadInfo: loadUserInfo }}>
        <Outlet />
      </UserInfoContext.Provider>
    </ConfigProvider>
  );
}
