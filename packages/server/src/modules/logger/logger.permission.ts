// 日志
export const PERMISSION = {
  LIST: {
    code: 'admin:logger:list',
    cname: '获取日志列表',
  },
  INFO: {
    code: 'admin:logger:info',
    cname: '获取日志详情',
  },
} as const;

export const LOGGER_PERMISSION_LIST = Object.values(PERMISSION);
