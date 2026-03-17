import {
  adminMenuConfig,
  adminMenuViewRules,
  BUSINESS_MENU_KEY,
  PLATFORM_MENU_KEY,
  type AppNavigableRoutePath,
  type AdminMenuChildRoute,
  type AdminMenuGroupKey,
  type AdminRoutePath,
  type AdminMenuRoute,
  type AdminMenuView,
} from '@/router/menu-config';
import { pathToRegexp } from 'path-to-regexp';

interface Item {
  label: string;
  icon?: JSX.Element;
  key: string;
  children?: Item[];
}

interface MenuGroupItem extends Item {
  groupKey?: AdminMenuGroupKey;
}

type AdminMenuNode = AdminMenuRoute | AdminMenuChildRoute;

const MENU_VIEW_GROUP_MAP: Record<AdminMenuView, AdminMenuGroupKey> = {
  business: BUSINESS_MENU_KEY,
  platform: PLATFORM_MENU_KEY,
};

function getMenuGroup(route: AdminMenuRoute) {
  return route.meta.menuGroup;
}

function matchRoutePath(path: AdminMenuNode['path'], pathname: string) {
  return pathToRegexp(path.replace(/\$/g, ':')).regexp.test(pathname);
}

function getGroupKeyByView(view: AdminMenuView) {
  return MENU_VIEW_GROUP_MAP[view];
}

function getMatchedRootRoute(pathname: string) {
  return adminMenuConfig.find((route) => {
    if (matchRoutePath(route.path, pathname)) {
      return true;
    }

    return route.routes?.some((childRoute) => matchRoutePath(childRoute.path, pathname));
  });
}

export function getMenuViewByPathname(pathname: string = location.pathname): AdminMenuView {
  const hiddenRouteRule = adminMenuViewRules.find((rule) => matchRoutePath(rule.path, pathname));
  if (hiddenRouteRule) {
    return hiddenRouteRule.view;
  }

  const groupKey = getMatchedRootRoute(pathname)?.meta?.menuGroup.key;
  return groupKey === PLATFORM_MENU_KEY ? 'platform' : 'business';
}

export function routers2menu(routers: AdminMenuNode[]) {
  const menuList: Item[] = [];

  function loop(menus: Item[], children: AdminMenuNode[]) {
    children.forEach((route) => {
      if (route.menuHide) return;

      const item: Item = {
        label: route.title,
        key: route.path,
      };

      if (route.routes) {
        item.children = [];
        loop(item.children, route.routes);
      }

      if (item.children && item.children.length <= 1) {
        menus.push(...item.children);
        return;
      }

      menus.push(item);
    });
  }

  loop(menuList, routers);
  return menuList;
}

function getFirstVisiblePath(routers: AdminMenuNode[]): AppNavigableRoutePath | undefined {
  for (const route of routers) {
    if (route.menuHide) continue;

    if (route.routes) {
      const childPath = getFirstVisiblePath(route.routes);
      if (childPath) {
        return childPath;
      }
    }

    return route.path as AppNavigableRoutePath;
  }

  return undefined;
}

export function getMenuEntryPath(view: AdminMenuView): AppNavigableRoutePath {
  const entryPath = getFirstVisiblePath(
    adminMenuConfig.filter((route) => getMenuGroup(route).key === getGroupKeyByView(view)),
  );

  if (entryPath) {
    return entryPath;
  }

  // In practice this can happen when a whole menu view is temporarily hidden
  // (e.g. feature flag, permissions, or mis-config). Never hard-crash the app.
  const fallbackView: AdminMenuView = view === 'business' ? 'platform' : 'business';
  const fallbackPath = getFirstVisiblePath(
    adminMenuConfig.filter((route) => getMenuGroup(route).key === getGroupKeyByView(fallbackView)),
  );
  if (fallbackPath) {
    console.warn(`[menu] Missing visible menu entry for ${view}, fallback to ${fallbackView}: ${fallbackPath}`);
    return fallbackPath;
  }

  throw new Error(`Missing visible menu entry for ${view} and ${fallbackView}`);
}

export function getNavMenu(view: AdminMenuView) {
  const currentGroupKey = getGroupKeyByView(view);
  return adminMenuConfig
    .filter((route) => getMenuGroup(route).key === currentGroupKey)
    .flatMap((route) => {
      const [menuItem] = routers2menu([route]) as MenuGroupItem[];
      if (!menuItem) {
        return [];
      }
      menuItem.groupKey = currentGroupKey;
      return [menuItem];
    });
}

function findMatchedMenuKeys(
  pathname: string,
  routers: AdminMenuNode[],
  parentKeys: string[] = [],
): string[] | undefined {
  for (const route of routers) {
    const visibleKeys = !route.menuHide ? [...parentKeys, route.path] : parentKeys;

    if (route.routes) {
      const result = findMatchedMenuKeys(pathname, route.routes, visibleKeys);
      if (result) {
        return result;
      }
    }

    if (matchRoutePath(route.path, pathname)) {
      return visibleKeys;
    }
  }

  return void 0;
}

export function getMenuState(
  pathname: string = location.pathname,
  view: AdminMenuView = getMenuViewByPathname(pathname),
) {
  const matchedKeys = findMatchedMenuKeys(pathname, adminMenuConfig) || [];
  const openKeys = matchedKeys.slice(0, -1);
  const matchedRootRoute = adminMenuConfig.find((route) => route.path === matchedKeys[0]);
  const matchedGroupKey = matchedRootRoute?.meta?.menuGroup.key;
  const currentGroupKey = getGroupKeyByView(view);

  if (matchedGroupKey && matchedGroupKey !== currentGroupKey) {
    return {
      selectedKeys: [],
      openKeys: [],
    };
  }

  return {
    selectedKeys: matchedKeys.length > 0 ? [matchedKeys[matchedKeys.length - 1]] : [],
    openKeys,
  };
}

export function getDefaultOpenKeys(
  pathname: string = location.pathname,
  view: AdminMenuView = getMenuViewByPathname(pathname),
) {
  return getMenuState(pathname, view).openKeys;
}
