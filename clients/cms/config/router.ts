// import { FundFilled } from '@ant-design/icons';

const router = {
  routes: [
    { path: '/login', component: 'login' },
    { path: '/nopassword', component: 'nopassword' },
    { path: '/_init_root_user', component: 'initRootUser' },
    { path: '/', redirect: '/user-admin/user-list' },
    {
      path: '/',
      component: '@/layouts/main',
      meta: {
        isMenuRoot: true,
      },
      routes: [
        {
          path: '/userinfo',
          component: 'userinfo',
          title: '用户信息',
          menuHide: true,
        },
        {
          path: '/user-admin',
          title: '后台账户管理',
          routes: [
            {
              path: '/user-admin/user-list',
              component: 'user-admin',
              title: '用户列表',
            },
            {
              path: '/user-admin/role-list',
              component: 'adminRole',
              title: '角色管理',
            },
          ],
        },
        {
          path: '/logger',
          component: 'logger',
          title: '系统日志',
        },

        {
          path: '/news',
          title: '新闻管理',
          routes: [
            {
              path: '/news/list',
              component: 'news',
              title: '新闻列表',
            },
            {
              path: '/news/create',
              component: 'news/form',
              title: '新增新闻',
              menuHide: true,
            },
            {
              path: '/news/update/:id',
              component: 'news/form',
              title: '修改新闻',
              menuHide: true,
            },
          ],
        },
        {
          path: '/banner',
          title: '广告管理',
          routes: [
            {
              path: '/banner/list',
              component: 'banner',
              title: '广告列表',
            },
            {
              path: '/banner/create',
              component: 'banner/form',
              title: '新增广告',
              menuHide: true,
            },
            {
              path: '/banner/update/:id',
              component: 'banner/form',
              title: '修改广告',
              menuHide: true,
            },
          ],
        },
      ],
    },
    { path: '*', component: '404' },
  ],
};
export default router;
