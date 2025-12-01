// import { FundFilled } from '@ant-design/icons';

const router = {
  routes: [
    { path: '/login', component: 'login' },
    { path: '/nopassword', component: 'nopassword' },
    { path: '/_init_root_user', component: 'init-root-user' },
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
              component: 'admin-role',
              title: '角色管理',
            },
          ],
        },
        {
          path: '/dict',
          title: '字典管理',
          component: 'dict',
        },
        {
          path: '/dict/:id',
          title: '字典',
          component: 'dict-value',
          menuHide: true,
        },
        {
          path: '/content_translation/list',
          title: '内容翻译',
          component: 'content_translation/index',
        },
        {
          path: '/logger',
          component: 'logger',
          title: '系统日志',
        },
        {
          path: '/file-manage',
          component: 'file-manage',
          title: '文件管理',
        },
        {
          path: '/webhook-trans',
          title: 'Webhook中转',
          component: 'webhook-trans/index',
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
          path: '/banner/list',
          component: 'banner',
          title: '广告管理',
        },
      ],
    },
    { path: '*', component: '404' },
  ],
};
export default router;
