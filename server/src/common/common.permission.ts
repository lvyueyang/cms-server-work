import { ApiProperty } from '@nestjs/swagger';

export class CodeItem {
  @ApiProperty({ description: '角色编码' })
  code: string;
  /** 角色名称 */
  @ApiProperty({ description: '角色名称' })
  cname: string;
  /** 角色描述 */
  @ApiProperty({ description: '角色描述' })
  desc?: string;
  /** 角色分组 */
  @ApiProperty({ description: '角色分组' })
  groupName: string;
  /** 禁止重复注册 */
  @ApiProperty({ description: '禁止重复注册' })
  unique?: boolean;
}

/** 后台管理权限码 */
export const ADMIN_PERMISSION_CODE: CodeItem[] = [];

function verifyCodeList(data: CodeItem[]) {
  const codeList: string[] = [];
  const cnameList: string[] = [];
  data.forEach((item) => {
    codeList.push(item.code);
    cnameList.push(item.cname);
  });

  codeList.forEach((code) => {
    const len = codeList.filter((c) => c === code).length;
    if (len > 1) {
      throw new Error(`权限码 ${code} 重复`);
    }
  });
  cnameList.forEach((cname) => {
    const len = cnameList.filter((c) => c === cname).length;
    if (len > 1) {
      throw new Error(`权限码中文名 ${cname} 重复`);
    }
  });
}
verifyCodeList(ADMIN_PERMISSION_CODE);

/** 注册权限码 */
export function registerPermissionCode(info: CodeItem) {
  if (ADMIN_PERMISSION_CODE.find((i) => i.code === info.code && i.unique)) {
    throw new Error(`权限码 ${info.code} 禁止重复注册`);
  }
  if (ADMIN_PERMISSION_CODE.find((i) => i.code === info.code)) {
    console.warn(`权限码 ${info.code} 已存在，不会重复注册`);
    return;
  }
  ADMIN_PERMISSION_CODE.push(info);
}

/** 创建权限码组 */
export function createPermGroup(groupName: string) {
  return (
    code: string,
    cname: string,
    opt: Omit<CodeItem, 'groupName' | 'code' | 'cname'> = {},
  ): CodeItem => {
    return {
      code,
      cname,
      groupName,
      ...opt,
    };
  };
}
