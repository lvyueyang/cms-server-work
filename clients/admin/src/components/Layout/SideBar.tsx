import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { history, Link, useLocation } from 'umi';
import LOGO from '@/assets/logo.png';
import { cls } from '@/utils';
import { getDefaultOpenKeys, getNavMenu } from './getNavMenu';
import styles from './index.module.less';

const menuItems = getNavMenu();

function useSelectMenu() {
  const location = useLocation();
  const [selectKeys, setSelectKeys] = useState<string[]>(() => {
    return [location.pathname];
  });
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    return getDefaultOpenKeys();
  });
  const [collapsed, setCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === '1');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('sidebarCollapsed', !collapsed ? '1' : '0');
  };
  useEffect(() => {
    const openKeys = getDefaultOpenKeys(location.pathname);
    setOpenKeys(openKeys);
    setSelectKeys(openKeys);
  }, [location]);

  return {
    collapsed,
    openKeys,
    selectKeys,
    setSelectKeys,
    toggleCollapsed,
    setOpenKeys,
  };
}

export default function SideBar() {
  const { collapsed, selectKeys, setSelectKeys, setOpenKeys, toggleCollapsed } = useSelectMenu();
  return (
    <div className={cls(styles.sideBarContainer, collapsed && styles.collapsed)}>
      <Link
        to="/"
        className={styles.logoTitle}
      >
        <img
          src={LOGO}
          alt=""
          width={30}
          height={30}
        />
        <span className={styles.title}>管理后台</span>
      </Link>
      <Menu
        theme="dark"
        inlineCollapsed={collapsed}
        mode="inline"
        className={styles.menuList}
        items={menuItems as any}
        // openKeys={openKeys}
        selectedKeys={selectKeys}
        onClick={(e) => {
          setSelectKeys([e.key]);
          history.push(e.key);
        }}
        onOpenChange={(e) => {
          setOpenKeys(e);
        }}
      />
      <div className={styles.operate}>
        <div
          className={styles.item}
          onClick={() => {
            toggleCollapsed();
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </div>
  );
}
