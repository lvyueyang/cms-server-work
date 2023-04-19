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
  id: number;
  name: string;
  desc?: string;
  permission_code?: string[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface UserAdminInfo {
  id: number;
  username: string;
  password: string;
  cname: string;
  email: string;
  is_root?: boolean;
  /** @format date-time */
  out_login_date?: string;
  roles: AdminRole[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
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
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
  id: number;
  name: string;
  desc?: string;
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
