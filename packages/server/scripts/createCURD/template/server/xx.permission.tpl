// {{cname}}
export const PERMISSION = {
  CREATE: {
    code: 'admin:{{name}}:create',
    cname: '创建{{cname}}',
  },
  UPDATE: {
    code: 'admin:{{name}}:update',
    cname: '修改{{cname}}',
  },
  LIST: {
    code: 'admin:{{name}}:list',
    cname: '获取{{cname}}列表',
  },
  INFO: {
    code: 'admin:{{name}}:info',
    cname: '获取{{cname}}信息',
  },
  DELETE: {
    code: 'admin:{{name}}:delete',
    cname: '删除{{cname}}',
  },
} as const;

export const {{permissionName}}_PERMISSION_LIST = Object.values(PERMISSION);
