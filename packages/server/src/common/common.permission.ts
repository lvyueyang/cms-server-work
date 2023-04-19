import { USER_ADMIN_PERMISSION_LIST } from 'src/modules/user_admin/user_admin.permission';
import { ROLE_ADMIN_PERMISSION_LIST } from 'src/modules/user_admin_role/user_admin_role.permission';

export interface CodeItem {
  code: string;
  cname: string;
}

/** 后台管理权限码 */
export const ADMIN_PERMISSION_CODE = [
  ...USER_ADMIN_PERMISSION_LIST,
  ...ROLE_ADMIN_PERMISSION_LIST,
];

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
