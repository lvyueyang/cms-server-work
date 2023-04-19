// 新闻中心
export const PERMISSION = {
  CREATE: {
    code: 'admin:news:create',
    cname: '创建新闻中心',
  },
  UPDATE: {
    code: 'admin:news:update',
    cname: '修改新闻中心',
  },
  LIST: {
    code: 'admin:news:list',
    cname: '获取新闻中心列表',
  },
  INFO: {
    code: 'admin:news:info',
    cname: '获取新闻中心信息',
  },
  DELETE: {
    code: 'admin:news:delete',
    cname: '删除新闻中心',
  },
} as const;

export const NEWS_PERMISSION_LIST = Object.values(PERMISSION);
