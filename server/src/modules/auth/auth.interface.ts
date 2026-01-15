export enum LOGIN_TYPE {
  USER_CLIENT = 'user_client',
  USER_ADMIN = 'user_admin',
}

export class UserJWTPayload {
  username: string;
  id: number | string;
  type: LOGIN_TYPE;
  create_date: Date;
}
