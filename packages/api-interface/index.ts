/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserAdminLoginBody {
  /** 密码 */
  password: string;
  /** 用户名/邮箱 */
  username: string;
}

export interface UserAdminLoginResponse {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: {
    token: string;
  };
}

export interface UserAdminOutLoginResponse {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
}

export interface AdminRole {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
  /** 权限码 */
  permission_code?: string[];
  /** 关联用户 */
  users: string[];
}

export interface UserAdminInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 管理账户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
  /** 是否为根用户 */
  is_root?: boolean;
  /**
   * 退出登录时间
   * @format date-time
   */
  out_login_date?: string;
  /** 关联角色 */
  roles: AdminRole[];
  /** 新闻 */
  news: string[];
}

export interface UserAdminList {
  list: UserAdminInfo[];
  total: number;
}

export interface UserAdminListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: UserAdminList;
}

export interface UserAdminCreateDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 昵称 */
  cname: string;
  /** 邮箱 */
  email: string;
}

export interface UserAdminIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 用户 ID */
  data: number;
}

export interface UserAdminInfoResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: UserAdminInfo;
}

export interface UserAdminUpdateDto {
  /** 昵称 */
  cname: string;
}

export interface UserAdminUpdatePasswordDto {
  /** 密码 */
  password: string;
}

export interface UserAdminUpdateRolesDto {
  /** 角色 ID */
  roles: number[];
}

export interface ResponseResult {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
}

export interface UserAdminForgetPasswordDto {
  /** 邮箱 */
  email: string;
  /** 验证码 */
  code: string;
  /** 密码 */
  password: string;
}

export interface UserAdminFileUploadDto {
  /** @format binary */
  file: File;
}

export interface UserAdminCreateRootDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 昵称 */
  cname: string;
  /** 邮箱 */
  email: string;
}

export interface AdminRoleCreateDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
}

export interface AdminRoleIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 角色 ID */
  data: number;
}

export interface AdminRoleInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** ID */
  id: number;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
  /** 权限码 */
  permission_code?: string[];
}

export interface AdminRoleList {
  list: AdminRoleInfo[];
  total: number;
}

export interface AdminRoleListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: AdminRoleList;
}

export interface CodeInfo {
  code: string;
  cname: string;
}

export interface AdminPermissionCodeListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: CodeInfo[];
}

export interface AdminRoleInfoResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 角色详情 */
  data: AdminRoleInfo;
}

export interface AdminRoleUpdateDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  desc?: string;
}

export interface AdminRoleUpdatePermissionCodeDto {
  /** 权限码 */
  codes: string[];
}

export interface EmailValidateCodeCreateDto {
  /** 邮箱 */
  email: string;
}

export interface LoggerListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 日志列表 */
  data: string[];
}

export interface LoggerDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  /** 日志详情 */
  data: string[];
}

export interface NewsQueryListDto {
  /**
   * 分页查询-当前页
   * @default 1
   */
  current?: number;
  /**
   * 分页查询-每页数量
   * @default 10
   */
  page_size?: number;
  /** 新闻中心名称-模糊搜索 */
  keyword?: string;
}

export interface UserAdmin {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  /** 管理账户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
  /** 用户昵称 */
  cname: string;
  /** 用户邮箱 */
  email: string;
  /** 是否为根用户 */
  is_root?: boolean;
  /**
   * 退出登录时间
   * @format date-time
   */
  out_login_date?: string;
  /** 关联角色 */
  roles: AdminRole[];
  /** 新闻 */
  news: string[];
}

export interface NewsInfo {
  /**
   * 创建时间
   * @format date-time
   */
  create_date: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_date: string;
  id: number;
  title: string;
  cover: string;
  desc?: string;
  content: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
}

export interface NewsList {
  list: NewsInfo[];
  total: number;
}

export interface NewsListResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: NewsList;
}

export interface NewsDetailResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: NewsInfo;
}

export interface NewsCreateDto {
  /** 新闻中心名称 */
  title: string;
  /** 新闻中心描述 */
  desc?: string;
  /** 新闻中心封面 */
  cover: string;
  /** 新闻中心详情 */
  content: string;
}

export interface NewsUpdateDto {
  /** 新闻中心名称 */
  title: string;
  /** 新闻中心描述 */
  desc?: string;
  /** 新闻中心封面 */
  cover: string;
  /** 新闻中心详情 */
  content: string;
}

export interface NewsDetailIdResponseDto {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态描述
   * @default "请求成功"
   */
  message: string;
  data: number;
}
