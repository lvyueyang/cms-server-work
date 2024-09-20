import { cls } from '@/utils';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, history, useLocation } from 'umi';
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
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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
  const { collapsed, selectKeys, setSelectKeys, setOpenKeys } = useSelectMenu();
  return (
    <div className={cls(styles.sideBarContainer, collapsed && styles.collapsed)}>
      <Link to="/" className={styles.logoTitle}>
        <span className={styles.title}>Template</span>
      </Link>
      <Menu
        theme="dark"
        inlineCollapsed={collapsed}
        defaultOpenKeys={menuItems.map((m) => m.key)}
        mode="inline"
        className={styles.menuList}
        items={menuItems}
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
    </div>
  );
}
