import workConfig from '../../../../../work.config.json';
import router from '../../../config/router';
const routes = router.routes;

interface RouterItem {
  path: string;
  icon?: React.ForwardRefExoticComponent<any>;
  title?: string;
  routes?: RouterItem[];
  menuHide?: boolean;
}

interface Item {
  label: string;
  icon?: JSX.Element;
  key: string;
  children?: Item[];
}

export function routers2menu(routers: RouterItem[]) {
  let menuList: Item[] = [];
  function loop(menus: Item[], children: RouterItem[]) {
    children.forEach((route) => {
      if (route.menuHide) return;
      const Icon = route.icon;
      const item: Item = {
        label: route.title || '',
        icon: Icon ? <Icon /> : void 0,
        key: `${route.path}`,
      };

      if (route.routes) {
        item.children = [];
        loop(item.children, route.routes);
      }
      menus.push(item);
    });
  }
  loop(menuList, routers);
  return menuList;
}

export function getNavMenu() {
  const menuRouters =
    routes.find((r) => r.path === '/' && r.routes)?.routes?.filter((item) => item.title) || [];
  return routers2menu(menuRouters);
}
export function getDefaultOpenKeys() {
  const list = location.pathname
    .replace(new RegExp(`${workConfig.cms_admin_path}`), '')
    .split('/')
    .filter((item) => item !== '/' && !!item);
  const keys: string[] = [];
  list.forEach((key) => {
    const prev = keys[keys.length - 1] || '';
    keys.push(`${prev}/${key}`);
  });
  return keys;
}
