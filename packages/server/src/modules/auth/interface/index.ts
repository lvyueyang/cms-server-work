export const enum LOGIN_TYPE {
  USER = 'user',
  USER_ADMIN = 'user_admin',
}

export class UserAdminJWTPayload {
  username: string;
  id: number;
  type: LOGIN_TYPE.USER_ADMIN;
  create_date: Date;
}
