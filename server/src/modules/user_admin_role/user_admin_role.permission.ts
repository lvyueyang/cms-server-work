// 角色
export const PERMISSION = {
  CREATE: {
    code: 'admin:role:create',
    cname: '创建管理后台角色',
  },
  UPDATE: {
    code: 'admin:role:update',
    cname: '修改管理后台角色',
  },
  LIST: {
    code: 'admin:role:list',
    cname: '获取管理后台角色列表',
  },
  INFO: {
    code: 'admin:role:info',
    cname: '获取管理后台角色信息',
  },
  DELETE: {
    code: 'admin:role:delete',
    cname: '删除管理后台角色',
  },
  UPDATE_CODE: {
    code: 'admin:role:code:update',
    cname: '修改管理后台角色权限码',
  },
} as const;

export const ROLE_ADMIN_PERMISSION_LIST = Object.values(PERMISSION);
