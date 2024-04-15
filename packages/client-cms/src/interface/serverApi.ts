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

export interface GetProductListQueryDto {
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
  /** 套件名称-模糊搜索 */
  keyword?: string;
}

export interface GetProductListResponseDto {
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
  /** 套件列表 */
  data: object;
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

export interface UserAdmin {
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

export interface Product {
  id: number;
  name: string;
  cover: string;
  desc: string;
  content: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface GetProductDetailResponseDto {
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
  /** 套件详情 */
  data: Product;
}

export interface CreateProductBodyDto {
  /** 套件名称 */
  name: string;
  /** 套件描述 */
  desc: string;
  /** 套件封面 */
  cover: string;
  /** 套件详情 */
  content: string;
}

export interface ProductByIdResponseDto {
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
  /** 套件 ID */
  data: number;
}

export interface UpdateProductBodyDto {
  /** 套件名称 */
  name: string;
  /** 套件描述 */
  desc: string;
  /** 套件封面 */
  cover: string;
  /** 套件详情 */
  content: string;
  /** 套件 ID */
  id: number;
}

export interface CominfoInfo {
  type: 'shishiwanghuo';
  id: number;
  title?: string;
  cover?: string;
  desc?: string;
  content?: string;
  data?: object;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface CominfoDetailResponseDto {
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
  data: CominfoInfo;
}

export interface CominfoUpdateDto {
  /** 公司信息类型 */
  type: 'shishiwanghuo';
  /** 公司信息名称 */
  title?: string;
  /** 公司信息描述 */
  desc?: string;
  /** 公司信息封面 */
  cover?: string;
  /** 公司信息详情 */
  content?: string;
  /** 公司信息数据信息， 可以存储json对象 */
  data?: object;
}

export interface CominfoDetailIdResponseDto {
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

export interface GetSolutionListQueryDto {
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
  /** 应用案例名称-模糊搜索 */
  keyword?: string;
}

export interface GetSolutionListResponseDto {
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
  /** 应用案例列表 */
  data: object;
}

export interface Solution {
  id: number;
  name: string;
  desc: string;
  content: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface GetSolutionDetailResponseDto {
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
  /** 应用案例详情 */
  data: Solution;
}

export interface CreateSolutionBodyDto {
  /** 应用案例名称 */
  name: string;
  /** 应用案例描述 */
  desc: string;
  /** 应用案例详情 */
  content: string;
}

export interface SolutionByIdResponseDto {
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
  /** 应用案例 ID */
  data: number;
}

export interface UpdateSolutionBodyDto {
  /** 应用案例名称 */
  name: string;
  /** 应用案例描述 */
  desc: string;
  /** 应用案例详情 */
  content: string;
  /** 应用案例 ID */
  id: number;
}

export interface SceneQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 应用场景名称-模糊搜索 */
  keyword?: string;
}

export interface SceneListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface SceneInfo {
  type: '2' | '4' | '3' | '1';
  id: number;
  title: string;
  desc?: string;
  content: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface SceneDetailResponseDto {
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
  data: SceneInfo;
}

export interface SceneCreateDto {
  /** 应用场景名称 */
  title: string;
  /** 应用场景描述 */
  desc?: string;
  /** 应用场景类型 */
  type: '2' | '4' | '3' | '1';
  /** 应用场景详情 */
  content: string;
}

export interface SceneUpdateDto {
  /** 应用场景名称 */
  title: string;
  /** 应用场景描述 */
  desc?: string;
  /** 应用场景类型 */
  type: '2' | '4' | '3' | '1';
  /** 应用场景详情 */
  content: string;
}

export interface SceneDetailIdResponseDto {
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

export interface UserLoginBodyDto {
  /** 手机号 */
  phone: string;
  /** 手机号验证码 */
  phone_code: string;
  /** 手机号验证码 HASH */
  phone_code_hash: string;
}

export interface UserInfo {
  id: number;
  username: string;
  password: string;
  cname?: string;
  email?: string;
  phone: string;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface UserList {
  list: UserInfo[];
  total: number;
}

export interface UserListResponseDto {
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
  data: UserList;
}

export interface GetNewsListQueryDto {
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
  /** 新闻名称-模糊搜索 */
  keyword?: string;
}

export interface GetNewsListResponseDto {
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
  /** 新闻列表 */
  data: object;
}

export interface News {
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  id: number;
  title: string;
  desc?: string;
  cover?: string;
  origin: string;
  /** @format date-time */
  push_date?: string;
  content: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface GetNewsDetailResponseDto {
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
  /** 新闻详情 */
  data: News;
}

export interface CreateNewsBodyDto {
  /** 新闻名称 */
  title: string;
  /** 新闻封面 */
  cover?: string;
  /** 新闻描述 */
  desc?: string;
  /** 新闻来源 */
  origin: string;
  /** 新闻详情 */
  content: string;
  /**
   * 发布时间
   * @format date-time
   */
  push_date: string;
  /**
   * 推荐等级, 0 为不推荐
   * @min 0
   */
  recommend: number;
}

export interface NewsByIdResponseDto {
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
  /** 新闻 ID */
  data: number;
}

export interface UpdateNewsBodyDto {
  /** 新闻名称 */
  title: string;
  /** 新闻封面 */
  cover?: string;
  /** 新闻描述 */
  desc?: string;
  /** 新闻来源 */
  origin: string;
  /** 新闻详情 */
  content: string;
  /**
   * 发布时间
   * @format date-time
   */
  push_date: string;
  /**
   * 推荐等级, 0 为不推荐
   * @min 0
   */
  recommend: number;
  /** 新闻 ID */
  id: number;
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
  /** 查询结果 */
  data: object;
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

export interface UserAdminForgetPasswordDto {
  /** 邮箱 */
  email: string;
  /** 验证码 */
  code: string;
  /** 密码 */
  password: string;
}

export interface UserAdminSTSInfoResponseDto {
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
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    Expiration: string;
    Bucket: string;
    Endpoint: string;
  };
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

export interface GetSystemImageListQueryDto {
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
  /** 系统镜像名称-模糊搜索 */
  keyword?: string;
}

export interface GetSystemImageListResponseDto {
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
  /** 系统镜像列表 */
  data: object;
}

export interface SystemImageVersion {
  id: number;
  version: string;
  is_stable: boolean;
  url: string;
  bucket: string;
  object_path: string;
  desc: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  systemImageId?: number;
  system_image: SystemImage;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface SystemImage {
  id: number;
  name: string;
  cover: string;
  desc: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  system_image_version: SystemImageVersion[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface GetSystemImageDetailResponseDto {
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
  /** 系统镜像详情 */
  data: SystemImage;
}

export interface CreateSystemImageBodyDto {
  /** 系统镜像名称 */
  name: string;
  /** 系统镜像描述 */
  desc: string;
  /** 系统镜像封面 */
  cover: string;
}

export interface SystemImageByIdResponseDto {
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
  /** 系统镜像 ID */
  data: number;
}

export interface UpdateSystemImageBodyDto {
  /** 系统镜像名称 */
  name: string;
  /** 系统镜像描述 */
  desc: string;
  /** 系统镜像封面 */
  cover: string;
  /** 系统镜像 ID */
  id: number;
}

export interface GetSystemImageVersionListQueryDto {
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
}

export interface GetSystemImageVersionListResponseDto {
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
  /** 系统镜像版本列表 */
  data: object;
}

export interface CreateSystemImageVersionBodyDto {
  /** 系统镜像版本号 */
  version: string;
  /** 系统镜像版本描述 */
  desc: string;
  /** 系统镜像版本是否为最新稳定版本 */
  is_stable: boolean;
}

export interface SystemImageVersionByIdResponseDto {
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
  /** 系统镜像版本 ID */
  data: number;
}

export interface UpdateSystemImageVersionIsoFileDto {
  /** 系统镜像版本 ID */
  id: number;
  /** 系统镜像版本文件地址 */
  url: string;
  /** 系统镜像 存储桶 */
  bucket: string;
  /** 系统镜像 对象路径 */
  object_path: string;
}

export interface UpdateSystemImageVersionBodyDto {
  /** 系统镜像版本 ID */
  id: number;
  /** 系统镜像版本描述 */
  desc: string;
  /** 系统镜像版本是否为最新稳定版本 */
  is_stable: boolean;
}

export interface SystemImageFreeQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 免费镜像名称-模糊搜索 */
  keyword?: string;
}

export interface SystemImageFreeListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface SystemImageFreeInfo {
  id: number;
  title: string;
  cover: string;
  desc?: string;
  version: string;
  total: number;
  bucket: string;
  object_path: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface SystemImageFreeDetailResponseDto {
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
  data: SystemImageFreeInfo;
}

export interface SystemImageFreeCreateDto {
  /** 名称 */
  title: string;
  /** 描述 */
  desc?: string;
  /** 封面 */
  cover: string;
  /** 版本号 */
  version: string;
}

export interface SystemImageFreeUpdateDto {
  /** 名称 */
  title: string;
  /** 描述 */
  desc?: string;
  /** 封面 */
  cover: string;
  /** 版本号 */
  version: string;
  /** 存储桶 */
  bucket: string;
  /** 对象路径 */
  object_path: string;
}

export interface SystemImageFreeDetailIdResponseDto {
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

export interface ProductDocumentQueryListDto {
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
  /** 产品文档名称-模糊搜索 */
  keyword?: string;
}

export interface ProductDocumentListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface ProductDocumentInfo {
  id: number;
  title: string;
  cover: string;
  desc?: string;
  resource_url: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface ProductDocumentDetailResponseDto {
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
  data: ProductDocumentInfo;
}

export interface ProductDocumentCreateDto {
  /** 产品文档名称 */
  title: string;
  /** 产品文档描述 */
  desc?: string;
  /** 产品文档封面 */
  cover: string;
  /** 资源地址 */
  resource_url: string;
}

export interface ProductDocumentUpdateDto {
  /** 产品文档名称 */
  title: string;
  /** 产品文档描述 */
  desc?: string;
  /** 产品文档封面 */
  cover: string;
  /** 资源地址 */
  resource_url: string;
}

export interface ProductDocumentDetailIdResponseDto {
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

export interface EmailValidateCodeCreateDto {
  /** 邮箱 */
  email: string;
}

export interface ImageValidateCodeResponseDto {
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
    data: string;
    hash: string;
  };
}

export interface SMSValidateCodeCreateDto {
  /** 手机号 */
  phone: string;
  /** 图片验证码 */
  image_code: string;
  /** 图片验证码 HASH */
  image_code_hash: string;
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

export interface IsoDownloadApplyQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 镜像下载申请名称-模糊搜索 */
  keyword?: string;
}

export interface IsoDownloadApplyListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface IsoDownloadApplyCreateDto {
  /** 电子邮件 */
  email: string;
  /** 镜像版本 ID */
  image_version_id: number;
}

export interface IsoDownloadApplyInfo {
  status: 0 | 1 | 2;
  id: number;
  name: string;
  company: string;
  company_city: string;
  company_address: string;
  department: string;
  position: string;
  industry: string;
  email: string;
  phone: string;
  source: string;
  contact: string;
  remark?: string;
  imageVersionId: number;
  signedUrl: string;
  /** @format date-time */
  expireDate: string;
  /** @format date-time */
  sendDate: string;
  imageVersion: SystemImageVersion;
  is_delete: boolean;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface IsoDownloadApplyDetailResponseDto {
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
  data: IsoDownloadApplyInfo;
}

export interface IsoDownloadApplyUpdateDto {
  /** 镜像版本 ID */
  status: 0 | 1 | 2;
}

export interface IsoDownloadApplyDetailIdResponseDto {
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

export interface IsoDownloadApplySendSignedUrlDto {
  /** 过期秒数 */
  expire_number: number;
}

export interface HardwareEcologyQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 硬件生态名称-模糊搜索 */
  keyword?: string;
}

export interface HardwareEcologyListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface HardwareEcologyInfo {
  id: number;
  company_name: string;
  product_name: string;
  processor_model: string;
  /** @format date-time */
  adaptation_date: string;
  detail_url: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface HardwareEcologyDetailResponseDto {
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
  data: HardwareEcologyInfo;
}

export interface HardwareEcologyCreateDto {
  /** 公司名称 */
  company_name: string;
  /** 适配产品 */
  product_name: string;
  /** 处理器型号 */
  processor_model: string;
  /**
   * 适配日期
   * @format date-time
   */
  adaptation_date: string;
  /** 详情地址 */
  detail_url: string;
}

export interface HardwareEcologyUpdateDto {
  /** 公司名称 */
  company_name: string;
  /** 适配产品 */
  product_name: string;
  /** 处理器型号 */
  processor_model: string;
  /**
   * 适配日期
   * @format date-time
   */
  adaptation_date: string;
  /** 详情地址 */
  detail_url: string;
}

export interface HardwareEcologyDetailIdResponseDto {
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

export interface SoftwareEcologyQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 软件生态名称-模糊搜索 */
  keyword?: string;
}

export interface SoftwareEcologyListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface SoftwareEcologyInfo {
  /** 推荐等级, 0 为不推荐, 后续可根据值大小进行排序 */
  recommend: number;
  id: number;
  type_name: string;
  name: string;
  desc: string;
  version?: string;
  is_delete: boolean;
  authorId?: number;
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface SoftwareEcologyDetailResponseDto {
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
  data: SoftwareEcologyInfo;
}

export interface SoftwareEcologyCreateDto {
  /** 软件生态分类名称 */
  type_name: string;
  /** 软件生态名称 */
  name: string;
  /** 软件生态描述 */
  desc: string;
  /** 软件生态版本 */
  version: string;
  /**
   * 推荐等级, 0 为不推荐
   * @min 0
   */
  recommend: number;
}

export interface SoftwareEcologyUpdateDto {
  /** 软件生态分类名称 */
  type_name: string;
  /** 软件生态名称 */
  name: string;
  /** 软件生态描述 */
  desc: string;
  /** 软件生态版本 */
  version: string;
  /**
   * 推荐等级, 0 为不推荐
   * @min 0
   */
  recommend: number;
}

export interface SoftwareEcologyDetailIdResponseDto {
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

export interface RemoteTryOutConnectDto {
  /** 远程试用 ID */
  id: number;
}

export interface RemoteTryOutQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 远程试用名称-模糊搜索 */
  keyword?: string;
}

export interface RemoteTryOutListResponseDto {
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
  /** 查询结果 */
  data: object;
}

export interface RemoteTryOutInfo {
  /** 远程试用 ID */
  id: number;
  /** 远程试用名称 */
  title: string;
  /** 远程试用封面 */
  cover: string;
  /** 最大链接数 */
  connectMaxTotal: number;
  /** 单次试用时长 (秒) */
  duration: number;
  /** 远程试用描述 */
  desc?: string;
  /** 版本号 */
  version: string;
  /** SSH IP 地址 */
  sshHostname: string;
  /** SSH 端口 */
  sshPort: string;
  /** SSH 用户名 */
  sshUsername: string;
  /** SSH 密码 */
  sshPassword: string;
  /** SSH 私钥 */
  sshPrivateKey: string;
  /** 是否已删除 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
  /** 创建者 */
  author: UserAdmin;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface RemoteTryOutDetailResponseDto {
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
  data: RemoteTryOutInfo;
}

export interface RemoteTryOutCreateDto {
  /** 远程试用名称 */
  title: string;
  /** 远程试用封面 */
  cover: string;
  /** 最大链接数 */
  connectMaxTotal: number;
  /** 单次试用时长 (秒) */
  duration: number;
  /** 远程试用描述 */
  desc?: string;
  /** 版本号 */
  version: string;
  /** SSH IP 地址 */
  sshHostname: string;
  /** SSH 端口 */
  sshPort: string;
  /** SSH 用户名 */
  sshUsername: string;
  /** SSH 密码 */
  sshPassword: string;
  /** SSH 私钥 */
  sshPrivateKey: string;
}

export interface RemoteTryOutUpdateDto {
  /** 远程试用名称 */
  title: string;
  /** 远程试用封面 */
  cover: string;
  /** 最大链接数 */
  connectMaxTotal: number;
  /** 单次试用时长 (秒) */
  duration: number;
  /** 远程试用描述 */
  desc?: string;
  /** 版本号 */
  version: string;
  /** SSH IP 地址 */
  sshHostname: string;
  /** SSH 端口 */
  sshPort: string;
  /** SSH 用户名 */
  sshUsername: string;
  /** SSH 密码 */
  sshPassword: string;
  /** SSH 私钥 */
  sshPrivateKey: string;
}

export interface RemoteTryOutDetailIdResponseDto {
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

export interface TrackMetaEventQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 元事件名称-模糊搜索 */
  keyword?: string;
}

export interface TrackMetaProperties {
  /** 元属性 ID */
  id: number;
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'LIST';
  /** 是否已删除 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackMetaEvent {
  /** 元事件 ID */
  id: number;
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 是否已删除 */
  is_delete: boolean;
  /** 元事件创建者 ID */
  authorId?: number;
  /** 事件属性 */
  properties?: TrackMetaProperties[];
  trackEvents: TrackEvent[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  cname?: string;
  email?: string;
  phone: string;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackEventProperties {
  /** ID */
  id: number;
  /** 属性名称 */
  key: string;
  /** 属性值 */
  value: string;
  /** 属性类型 */
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'LIST';
  /** 事件记录 */
  trackEvent: TrackEvent[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackEvent {
  /** 事件分析 ID */
  id: number;
  /** 事件名称 */
  name: string;
  /** 元事件ID */
  metaEventId: number;
  /** 元事件信息 */
  metaEvent: TrackMetaEvent;
  /** 关联用户 ID */
  userId: number;
  /** 关联用户 */
  user: User;
  /** 事件属性 */
  properties: TrackEventProperties[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackMetaEventInfo {
  /** 元事件 ID */
  id: number;
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 是否已删除 */
  is_delete: boolean;
  /** 元事件创建者 ID */
  authorId?: number;
  /** 事件属性 */
  properties?: TrackMetaProperties[];
  trackEvents: TrackEvent[];
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackMetaEventList {
  list: TrackMetaEventInfo[];
  total: number;
}

export interface TrackMetaEventListResponseDto {
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
  /** 查询结果 */
  data: TrackMetaEventList;
}

export interface TrackMetaEventDetailResponseDto {
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
  data: TrackMetaEventInfo;
}

export interface TrackMetaEventCreateDto {
  /** 元事件名称 */
  name: string;
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 事件属性名称列表 */
  properties: string[];
}

export interface TrackMetaEventUpdateDto {
  /** 元事件显示名称 */
  cname: string;
  /** 元事件描述 */
  desc?: string;
  /** 事件属性名称列表 */
  properties: string[];
}

export interface TrackMetaEventDetailIdResponseDto {
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

export interface TrackMetaPropertiesQueryListDto {
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
  /**
   * 被排序的字段
   * @default "create_at"
   */
  order_key?: string;
  /**
   * 排序方式 DESC 降序 ASC 倒序
   * @default 10
   */
  order_type?: string;
  /** 元属性名称-模糊搜索 */
  keyword?: string;
}

export interface TrackMetaPropertiesInfo {
  /** 元属性 ID */
  id: number;
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'LIST';
  /** 是否已删除 */
  is_delete: boolean;
  /** 创建者 ID */
  authorId?: number;
  /** @format date-time */
  create_date: string;
  /** @format date-time */
  update_date: string;
}

export interface TrackMetaPropertiesListResponseDto {
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
    list: TrackMetaPropertiesInfo[];
    total: number;
  };
}

export interface TrackMetaPropertiesDetailResponseDto {
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
  data: TrackMetaPropertiesInfo;
}

export interface TrackMetaPropertiesCreateDto {
  /** 元属性名称 */
  name: string;
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
  /** 元属性类型 */
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'LIST';
}

export interface TrackMetaPropertiesUpdateDto {
  /** 元属性显示名 */
  cname: string;
  /** 元属性描述 */
  desc?: string;
}

export interface TrackMetaPropertiesDetailIdResponseDto {
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

export interface GetTrackEventListQueryDto {
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
  /** 按名称搜索 */
  name?: string;
  /** 开始时间 */
  start_date?: string;
  /** 结束时间 */
  end_date?: string;
}

export interface GetTrackEventListResponseDto {
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
    list: TrackEvent[];
    total: number;
  };
}

export interface GetTrackEventChartQueryDto {
  /** 事件名称 */
  name: string;
  /** 开始时间 */
  start_date: string;
  /** 结束时间 */
  end_date: string;
}

export interface ChartItem {
  /** 日期 */
  date: string;
  /** 数量 */
  count: number;
}

export interface GetTrackEventChartResponseDto {
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
  /** 结果 */
  data: ChartItem[];
}
