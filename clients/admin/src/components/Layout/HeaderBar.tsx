import { DownOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Setting } from '@icon-park/react';
import { useFullscreen } from 'ahooks';
import { Avatar, Breadcrumb, Dropdown } from 'antd';
import { useEffect, useRef } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { outLogin } from '@/services';
import { useGlobalStore } from '@/store/global';
import { useUserinfoStore } from '@/store/userinfo';
import { getBreadcrumbItems } from './getNavMenu';
import styles from './index.module.less';

export function HeaderBreadcrumb() {
  const location = useRouterState({
    select: (state) => state.location,
  });

  const globalStore = useGlobalStore();
  useEffect(() => {
    const currentPathname = location.pathname;
    globalStore.updateHeaderBreadcrumbItems(getBreadcrumbItems(currentPathname));
  }, [location]);

  return <Breadcrumb items={globalStore.headerBreadcrumbItems} />;
}

function PageFullscreenButton(props: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef(document.body);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  return (
    <div
      {...props}
      onClick={toggleFullscreen}
    >
      {!isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
    </div>
  );
}

export default function HeaderBar() {
  const { data: userInfo } = useUserinfoStore();
  const navigate = useNavigate();

  return (
    <div className={`${styles.headerContainer} header`}>
      <div>
        <HeaderBreadcrumb />
      </div>
      <div className={styles.userContainer}>
        <div
          className={styles.item}
          onClick={() => navigate({ to: '/setting' })}
        >
          <Setting size={19} />
        </div>
        <div className={styles.item}>
          <PageFullscreenButton />
        </div>
        <Dropdown
          menu={{
            items: [
              {
                label: '个人资料',
                key: 'userinfo',
                onClick: () => {
                  navigate({ to: '/userinfo' });
                },
              },
              {
                label: '退出',
                key: 'outlogin',
                onClick: () => {
                  outLogin();
                  navigate({ to: '/login', search: { redirect: undefined } });
                },
              },
            ],
          }}
        >
          <div className={styles.item}>
            <Avatar src={userInfo?.avatar}>{userInfo?.username}</Avatar>
            <span className={styles.username}>{userInfo?.cname || userInfo?.username}</span>
            <DownOutlined style={{ fontSize: 12 }} />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
