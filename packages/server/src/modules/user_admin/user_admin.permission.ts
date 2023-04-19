// 用户相关
export const PERMISSION = {
  LIST: {
    code: 'admin:user:list',
    cname: '获取管理后台用户列表',
  },
  CREATE: {
    code: 'admin:user:crate',
    cname: '创建管理后台用户',
  },
  UPDATE: {
    code: 'admin:user:update',
    cname: '修改管理后台用户信息',
  },
  PASSWORD_RESET: {
    code: 'admin:user:passwordreset',
    cname: '重置管理后台用户密码',
  },
  ROLE_UPDATE: {
    code: 'admin:user:roleupdate',
    cname: '更新用户角色',
  },
  UPLOAD_FILE: {
    code: 'admin:user:uploadfile',
    cname: '管理后台文件上传',
  },
  INFO: {
    code: 'admin:user:info',
    cname: '获取管理后台用户详情',
  },
} as const;

export const USER_ADMIN_PERMISSION_LIST = Object.values(PERMISSION);
