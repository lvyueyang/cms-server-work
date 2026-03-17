import { BreadcrumbProps, type MenuProps } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import {
  adminMenuConfig,
  AdminMenuView,
  BUSINESS_MENU_KEY,
  PLATFORM_MENU_KEY,
} from '@/router/menu-config';
import type { ForwardRefExoticComponent } from 'react';

interface RouterItem {
  path: string;
  icon?: ForwardRefExoticComponent<any>;
  title?: string;
  routes?: RouterItem[];
  menuHide?: boolean;
}

export function routers2menu(routers: RouterItem[]) {
  const menuList: NonNullable<MenuProps['items']> = [];

  function loop(menus: NonNullable<MenuProps['items']>, children: RouterItem[]) {
    children.forEach((route) => {
      if (route.menuHide) {
        if (route.routes?.length) {
          loop(menus, route.routes);
        }
        return;
      }
      const Icon = route.icon;
      const item: NonNullable<MenuProps['items']>[number] = {
        label: route.title || '',
        icon: Icon ? <Icon /> : void 0,
        key: `${route.path}`,
      };

      if (route.routes) {
        (item as any).children = [];
        loop((item as any).children, route.routes);
      }
      if ((item as any).children) {
        if ((item as any).children.length <= 1) {
          menus.push(...(item as any).children);
          return;
        }
      }
      menus.push(item);
    });
  }
  loop(menuList, routers);
  return menuList;
}

export function getNavMenu() {
  return routers2menu(adminMenuConfig);
}

interface TrailNode {
  path: string;
  title?: string;
  menuHide?: boolean;
  routes?: TrailNode[];
}

function normalizeToRegexpPath(path: string) {
  // TanStack file route params use `$id` 形式，这里转换成 path-to-regexp 可识别的 `:id`
  return path.replace(/\$([A-Za-z0-9_]+)/g, ':$1');
}

function matchPath(pattern: string, pathname: string) {
  try {
    const { regexp } = pathToRegexp(normalizeToRegexpPath(pattern));
    return regexp.test(pathname);
  } catch {
    return false;
  }
}

function findTrailByPath(
  pathname: string,
  routes: TrailNode[],
  parents: TrailNode[] = [],
): TrailNode[] | null {
  for (const route of routes) {
    const nextParents = route.routes?.length ? [...parents, route] : parents;
    if (matchPath(route.path, pathname)) {
      return [...parents, route];
    }
    if (route.routes?.length) {
      const result = findTrailByPath(pathname, route.routes, nextParents);
      if (result) return result;
    }
  }
  return null;
}

function pickDefaultVisibleChildPath(route: TrailNode) {
  const queue: TrailNode[] = [...(route.routes ?? [])];
  while (queue.length) {
    const node = queue.shift()!;
    if (node.routes?.length) {
      queue.unshift(...node.routes);
      continue;
    }
    if (!node.menuHide) return node.path;
  }
  return null;
}

export function getDefaultOpenKeys(pathname: string) {
  const trail = findTrailByPath(pathname, adminMenuConfig as any);
  if (!trail?.length) return [];
  // openKeys 只保留父级
  return trail.slice(0, -1).map((n) => n.path);
}

export function getSelectedMenuKeys(pathname: string) {
  const trail = findTrailByPath(pathname, adminMenuConfig as any);
  if (!trail?.length) return [];

  const last = trail[trail.length - 1];
  if (!last.menuHide && !last.routes?.length) return [last.path];

  // 当前落在隐藏页或父级节点上时，选中其最近的可见叶子（通常是 list 页）
  for (let i = trail.length - 1; i >= 0; i--) {
    const node = trail[i];
    if (node.routes?.length) {
      const entry = pickDefaultVisibleChildPath(node);
      if (entry) return [entry];
    }
  }
  return [];
}

export function getMenuEntryPath(view: AdminMenuView = 'business') {
  const groupKey = view === 'platform' ? PLATFORM_MENU_KEY : BUSINESS_MENU_KEY;
  const groupRoutes = adminMenuConfig.filter((item) => item.meta.menuGroup.key === groupKey) as any as TrailNode[];

  for (const route of groupRoutes) {
    if (route.routes?.length) {
      const entry = pickDefaultVisibleChildPath(route);
      if (entry) return entry;
    }
    if (!route.menuHide) return route.path;
  }

  return '/login';
}

export function getBreadcrumbItems(pathname: string): BreadcrumbProps['items'] {
  const trail = findTrailByPath(pathname, adminMenuConfig as any);
  if (!trail?.length) return [];
  return trail
    .filter((n) => !!n.title)
    .map((n) => ({
      title: n.title,
    }));
}
