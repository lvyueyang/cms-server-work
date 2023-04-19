import LOGO from '@/assets/logo.png';
import useUserInfo from '@/hooks/useUserInfo';
import { outLogin } from '@/services';
import { Avatar, Button, Menu, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import { getDefaultOpenKeys, getNavMenu } from './getNavMenu';
import styles from './index.module.less';

const menuItems = getNavMenu();

export default function SideBar() {
  const { userInfo } = useUserInfo();
  const [selectKeys, setSelectKeys] = useState<string[]>(() => {
    return [location.pathname];
  });
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    return getDefaultOpenKeys();
  });
  useEffect(() => {
    const openKeys = getDefaultOpenKeys();
    setOpenKeys(openKeys);
    setSelectKeys(openKeys);
  }, [location.pathname]);
  return (
    <div className={styles.sideBarContainer}>
      <Link to="/" className={styles.logoTitle}>
        <span className={styles.title}>
          <img src={LOGO} alt="" />
        </span>
      </Link>
      {/* 导航菜单 */}
      <Menu
        mode="inline"
        className={styles.menuList}
        items={menuItems}
        openKeys={openKeys}
        selectedKeys={selectKeys}
        onClick={(e) => {
          setSelectKeys([e.key]);
          history.push(e.key);
        }}
        onOpenChange={(e) => {
          setOpenKeys(e);
        }}
      />
      {/* 头像与退出 */}
      <Row className={styles.userContainer} align="middle">
        <Tooltip title={userInfo?.username}>
          <Link to="/userinfo">
            <Row align="middle">
              <Avatar shape="square" src="">
                {userInfo?.cname?.substring(0, 1).toLocaleUpperCase()}
              </Avatar>
              <span className={styles.username}>{userInfo?.cname}</span>
            </Row>
          </Link>
        </Tooltip>
        <div>
          <Button
            type="text"
            onClick={() => {
              outLogin();
              history.push('/login');
            }}
          >
            退出
          </Button>
        </div>
      </Row>
    </div>
  );
}
