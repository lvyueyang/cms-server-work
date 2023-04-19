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
      ],
    },
    { path: '*', component: '404' },
  ],
};
export default router;
