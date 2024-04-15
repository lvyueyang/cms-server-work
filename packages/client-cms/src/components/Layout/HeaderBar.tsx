import { outLogin } from '@/services';
import { useGlobalStore } from '@/store/global';
import { DownOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { Avatar, Breadcrumb, Dropdown } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import { useEffect, useRef } from 'react';
import { history, useAppData, useLocation } from 'umi';
import styles from './index.module.less';
import { useUserinfoStore } from '@/store/userinfo';

interface TreeNode {
  path?: string;
  title?: string;
  children?: TreeNode[];
}
function getParentNodesByKey(
  path?: string,
  tree: TreeNode[] = [],
  parentNodes: TreeNode[] = [],
): Omit<TreeNode, 'children'>[] | void {
  for (const node of tree) {
    const currentNode = {
      title: node.title,
      // onClick: () => {
      //   if (node.path) {
      //     history.push(node.path);
      //   }
      //   return false;
      // },
    };

    if (new RegExp(pathToRegexp(node.path!)).test(path!)) {
      return [...parentNodes, currentNode];
    }
    if (node.children) {
      const result = getParentNodesByKey(path, node.children, [...parentNodes, currentNode]);
      if (result) {
        return result;
      }
    }
  }
  return void 0;
}

export function HeaderBreadcrumb() {
  const { clientRoutes } = useAppData();
  const location = useLocation();

  const globalStore = useGlobalStore();
  useEffect(() => {
    const menuRoutes = clientRoutes[0].children?.find((i: any) => i.meta?.isMenuRoot)?.children;
    const currentPathname = location.pathname;
    const list = getParentNodesByKey(currentPathname, menuRoutes);
    if (list) {
      globalStore.updateHeaderBreadcrumbItems(list);
    }
  }, [location]);

  return <Breadcrumb items={globalStore.headerBreadcrumbItems} />;
}

function PageFullscreenButton(props: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef(document.body);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  return (
    <div {...props} onClick={toggleFullscreen}>
      {!isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
    </div>
  );
}

export default function HeaderBar() {
  const { data: userInfo } = useUserinfoStore();

  return (
    <div className={`${styles.headerContainer} header`}>
      <div>
        <HeaderBreadcrumb />
      </div>
      <div className={styles.userContainer}>
        <div className={styles.item}>
          <PageFullscreenButton />
        </div>
        <Dropdown
          menu={{
            items: [
              // {
              //   label: '个人资料',
              //   key: 'userinfo',
              //   onClick: () => {
              //     history.push('/userinfo');
              //   },
              // },
              {
                label: '退出',
                key: 'outlogin',
                onClick: () => {
                  outLogin();
                  history.push('/login');
                },
              },
            ],
          }}
        >
          <div className={styles.item}>
            <Avatar src={userInfo?.avatar}>{userInfo?.username}</Avatar>
            <span className={styles.username}>{userInfo?.username}</span>
            <DownOutlined style={{ fontSize: 12 }} />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
