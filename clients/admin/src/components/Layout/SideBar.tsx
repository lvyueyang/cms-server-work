import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import LOGO from '@/assets/logo.png';
import { cls } from '@/utils';
import { getDefaultOpenKeys, getMenuState, getMenuViewByPathname, getNavMenu } from './getNavMenu';
import styles from './index.module.less';

function useSelectMenu() {
  const location = useLocation();
  const sidebarMenuView = getMenuViewByPathname(location.pathname);
  const [selectKeys, setSelectKeys] = useState<string[]>(() => {
    return getMenuState(location.pathname, sidebarMenuView).selectedKeys;
  });
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    return getDefaultOpenKeys(location.pathname, sidebarMenuView);
  });
  const [collapsed, setCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === '1');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('sidebarCollapsed', !collapsed ? '1' : '0');
  };
  useEffect(() => {
    const { openKeys, selectedKeys } = getMenuState(location.pathname, sidebarMenuView);
    setOpenKeys(openKeys);
    setSelectKeys(selectedKeys);
  }, [location.pathname, sidebarMenuView]);

  return {
    collapsed,
    openKeys,
    selectKeys,
    sidebarMenuView,
    setSelectKeys,
    toggleCollapsed,
    setOpenKeys,
  };
}

export default function SideBar() {
  const navigate = useNavigate();
  const { collapsed, openKeys, selectKeys, setSelectKeys, setOpenKeys, toggleCollapsed, sidebarMenuView } =
    useSelectMenu();
  const menuItems = getNavMenu(sidebarMenuView);
  const isPlatformView = sidebarMenuView === 'platform';
  return (
    <div
      className={cls(
        styles.sideBarContainer,
        collapsed && styles.collapsed,
        isPlatformView ? styles.platformSection : styles.businessSection,
      )}
    >
      <Link
        to="/"
        className={cls(styles.logoTitle, isPlatformView ? styles.platformLogoTitle : styles.businessLogoTitle)}
      >
        {isPlatformView ? (
          <span className={styles.platformBadge}>
            <span className={styles.platformBadgeHint}>Platform</span>
            <span className={styles.title}>平台管理</span>
          </span>
        ) : (
          <>
            <img
              src={LOGO}
              alt=""
              width={30}
              height={30}
            />
            <span className={styles.businessBadge}>
              <span className={styles.title}>业务中心</span>
            </span>
          </>
        )}
      </Link>
      <Menu
        theme="dark"
        inlineCollapsed={collapsed}
        mode="inline"
        className={styles.menuList}
        items={menuItems as any}
        openKeys={openKeys}
        selectedKeys={selectKeys}
        onClick={(e) => {
          setSelectKeys([e.key]);
          navigate({ to: e.key as any });
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
