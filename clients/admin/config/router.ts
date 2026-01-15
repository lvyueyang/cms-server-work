const router = {
  routes: [
    { path: '/login', component: 'login' },
    { path: '/nopassword', component: 'nopassword' },
    { path: '/_init_root_user', component: 'init-root-user' },
    { path: '/', redirect: '/user-admin/user-list' },
    { path: '/demos/grapesjs', component: 'demos/grapesjs/index' },
    {
      path: '/',
      component: '@/layouts/main',
      meta: {
        isMenuRoot: true,
      },
      routes: [
        {
          path: '/setting',
          component: 'setting',
          title: '系统设置',
          menuHide: true,
        },
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
            {
              path: '/user-admin/client-list',
              component: 'user-client',
              title: '客户列表',
            },
          ],
        },
        {
          path: '/track',
          title: '事件分析',
          routes: [
            {
              path: '/track/event',
              component: 'track',
              title: '事件查询',
            },
            {
              path: '/track/chart',
              component: 'track-chart',
              title: '事件分析',
            },
            {
              path: '/track/meta/event',
              component: 'track-meta-event',
              title: '元事件',
            },
            {
              path: '/track/meta/properties',
              component: 'track-meta-properties',
              title: '属性管理',
            },
          ],
        },
        {
          path: '/i18n',
          title: '国际化管理',
          routes: [
            {
              path: '/i18n/content-translation',
              title: '内容翻译',
              component: 'content-translation/index',
            },
            {
              path: '/i18n/system-translation',
              title: '系统翻译',
              component: 'system-translation/index',
            },
          ],
        },
        {
          path: '/dict',
          title: '字典',
          routes: [
            {
              // 字典
              path: '/dict',
              title: '字典管理',
              component: 'dict',
            },
            {
              path: '/dict/:id',
              title: '字典值',
              component: 'dict-value',
              menuHide: true,
            },
          ],
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
          path: '/system-config',
          component: 'system-config',
          title: '系统配置',
        },
        {
          path: '/webhook-trans',
          title: 'Webhook中转',
          component: 'webhook-trans/index',
        },
        {
          path: '/banner/list',
          component: 'banner',
          title: '广告管理',
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
          path: '/public-article',
          title: '公开文章管理',
          routes: [
            {
              path: '/public-article/list',
              component: 'public-article',
              title: '公开文章列表',
            },
            {
              path: '/public-article/create',
              component: 'public-article/form',
              title: '新增公开文章',
            },
            {
              path: '/public-article/update/:id',
              component: 'public-article/form',
              title: '修改公开文章',
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
