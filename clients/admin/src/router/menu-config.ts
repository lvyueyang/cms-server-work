import type { FileRoutesByPath } from '@tanstack/react-router';

export const BUSINESS_MENU_KEY = '/business-management';
export const PLATFORM_MENU_KEY = '/platform-management';

export type AdminMenuView = 'business' | 'platform';
export type AppRoutePath = FileRoutesByPath[keyof FileRoutesByPath]['path'];
export type AppNavigableRoutePath = Exclude<AppRoutePath, ''>;
export type AdminMenuGroupKey = typeof BUSINESS_MENU_KEY | typeof PLATFORM_MENU_KEY;
export type AdminMenuGroupTitle = '业务菜单' | '平台菜单';
export type AdminMenuParentPath =
  | '/public-article'
  | '/news'
  | '/banner'
  | '/user-admin'
  | '/track'
  | '/i18n';
export type AdminRoutePath = AppRoutePath | AdminMenuParentPath;

interface AdminMenuRouteBase {
  path: AdminRoutePath;
  title: string;
  menuHide?: boolean;
}

export interface AdminMenuChildRoute extends AdminMenuRouteBase {
  routes?: AdminMenuChildRoute[];
}

export interface AdminMenuRoute extends AdminMenuRouteBase {
  meta: {
    menuGroup: {
      key: AdminMenuGroupKey;
      title: AdminMenuGroupTitle;
      order: number;
      forceGroup?: boolean;
    };
  };
  routes?: AdminMenuChildRoute[];
}

export interface AdminMenuViewRule {
  path: AdminRoutePath;
  view: AdminMenuView;
}

const businessMenuGroup = {
  key: BUSINESS_MENU_KEY,
  title: '业务菜单',
  order: 1,
  forceGroup: true,
} as const;

const platformMenuGroup = {
  key: PLATFORM_MENU_KEY,
  title: '平台菜单',
  order: 2,
  forceGroup: true,
} as const;

export const adminMenuConfig: AdminMenuRoute[] = [
  {
    path: '/public-article',
    title: '公开文章管理',
    menuHide: true,
    meta: {
      menuGroup: businessMenuGroup,
    },
    routes: [
      {
        path: '/public-article/list',
        title: '公开文章列表',
      },
      {
        path: '/public-article/create',
        title: '新增公开文章',
      },
      {
        path: '/public-article/update/$id',
        title: '修改公开文章',
        menuHide: true,
      },
    ],
  },
  {
    path: '/news',
    title: '新闻管理',
    menuHide: true,
    meta: {
      menuGroup: businessMenuGroup,
    },
    routes: [
      {
        path: '/news/list',
        title: '新闻列表',
      },
      {
        path: '/news/create',
        title: '新增新闻',
        menuHide: true,
      },
      {
        path: '/news/update/$id',
        title: '修改新闻',
        menuHide: true,
      },
    ],
  },
  {
    path: '/banner',
    title: '广告管理',
    menuHide: true,
    meta: {
      menuGroup: businessMenuGroup,
    },
    routes: [
      {
        path: '/banner/list',
        title: '广告列表',
      },
      {
        path: '/banner/create',
        title: '新增广告',
        menuHide: true,
      },
      {
        path: '/banner/update/$id',
        title: '修改广告',
        menuHide: true,
      },
    ],
  },
  {
    path: '/user-admin',
    title: '后台账户管理',
    meta: {
      menuGroup: platformMenuGroup,
    },
    routes: [
      {
        path: '/user-admin/user-list',
        title: '用户列表',
      },
      {
        path: '/user-admin/role-list',
        title: '角色管理',
      },
      {
        path: '/user-admin/client-list',
        title: '客户列表',
      },
    ],
  },
  {
    path: '/track',
    title: '事件分析',
    meta: {
      menuGroup: platformMenuGroup,
    },
    routes: [
      {
        path: '/track/event',
        title: '事件查询',
      },
      {
        path: '/track/chart',
        title: '事件分析',
      },
      {
        path: '/track/meta/event',
        title: '元事件',
      },
      {
        path: '/track/meta/properties',
        title: '属性管理',
      },
    ],
  },
  {
    path: '/i18n',
    title: '国际化管理',
    meta: {
      menuGroup: platformMenuGroup,
    },
    routes: [
      {
        path: '/i18n/content-translation',
        title: '内容翻译',
      },
      {
        path: '/i18n/system-translation',
        title: '系统翻译',
      },
    ],
  },
  {
    path: '/dict',
    title: '字典',
    meta: {
      menuGroup: platformMenuGroup,
    },
    routes: [
      {
        path: '/dict',
        title: '字典管理',
      },
      {
        path: '/dict/$id',
        title: '字典值',
        menuHide: true,
      },
    ],
  },
  {
    path: '/logger',
    title: '系统日志',
    meta: {
      menuGroup: platformMenuGroup,
    },
  },
  {
    path: '/file-manage',
    title: '文件管理',
    meta: {
      menuGroup: platformMenuGroup,
    },
  },
  {
    path: '/system-config',
    title: '系统配置',
    meta: {
      menuGroup: platformMenuGroup,
    },
  },
  {
    path: '/webhook-trans',
    title: 'Webhook中转',
    meta: {
      menuGroup: platformMenuGroup,
    },
  },
];

export const adminMenuViewRules: AdminMenuViewRule[] = [
  {
    path: '/setting',
    view: 'platform',
  },
  {
    path: '/userinfo',
    view: 'platform',
  },
];
