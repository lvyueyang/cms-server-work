// 广告
export const PERMISSION = {
  CREATE: {
    code: 'admin:banner:create',
    cname: '创建广告',
  },
  UPDATE: {
    code: 'admin:banner:update',
    cname: '修改广告',
  },
  LIST: {
    code: 'admin:banner:list',
    cname: '获取广告列表',
  },
  INFO: {
    code: 'admin:banner:info',
    cname: '获取广告信息',
  },
  DELETE: {
    code: 'admin:banner:delete',
    cname: '删除广告',
  },
} as const;

export const BANNER_PERMISSION_LIST = Object.values(PERMISSION);
