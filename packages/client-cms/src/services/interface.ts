export interface Pagination {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  page_size: number;
}

export interface Result<T> {
  code: number;
  data: T;
  msg: string;
}

export type ListResult<T> = Result<{
  /** 当前页码 */
  page: number;
  /** 总条数 */
  total: number;
  /** 列表数据 */
  list: T[];
}>;

export interface LoginBody {
  /** 用户名 */
  user_name: string;
  /** 密码 */
  password: string;
}
export interface LoginResult {
  /** 用户 token */
  token: string;
}

/** 当前登录用户信息 */
export interface UserInfo {
  /** 用户名 */
  user_name: string;
}

/** 租户信息 */
export interface TenantItem {
  /** 用户id */
  uuid: string;
  /** 电子邮箱，比如 example@qq.com */
  email: string;
  /** 联系方式 */
  phone: string;
  /** 使用容量 */
  used_capacity: string;
  /** 账户余额 */
  account_balance: number;
  /** 注册时间 */
  register_time: string;
  /** 资源使用数 */
  pod_num: number;
  /** 账户类型 */
  account_type: string;
}

export interface TenantAccountTypeTotalItem {
  account_type: number;
  total_count: number;
}

/** 超管信息 */
export interface SuperAdminInfo {
  /** 账号 */
  user_name: string;
  /** 密码 */
  password: string;
}

export interface InvitationItem {
  code: string;
  status: string;
  bind_uuid: string;
  /** 备注 */
  desc: string;
  created_at: string;
}

export interface CreateInvitationBody {
  desc: string;
}

export interface SystemConfigItem {
  name: string;
  key: string;
  value: string;
  desc: string;
  created_at: string;
  updated_at: string;
}
export type SystemConfigBody = Pick<SystemConfigItem, 'key' | 'name' | 'value' | 'desc'>;

/** 概览数据 */
export interface OverFlowDataResult {
  /** 总数量 */
  total_equipment: number;
  /** 在线数量 */
  up_equipment: number;
  /** 离线数量 */
  down_equipment: number;
}

export interface DeviceItemResult {
  /** 设备ip */
  ip: string;
  /** 主机名称 */
  host_name: string;
  /** 操作系统 */
  system_info: string;
  /** 网络状态 true 正常 false 异常 */
  network_status: boolean;
  /** 服务状态 true 正常 false 异常 */
  service_status: boolean;
}
