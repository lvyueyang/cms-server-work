import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { isEmail } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { userConfig } from 'src/config';
import { passwordCrypto } from 'src/utils';
import { UserAdminService } from '../user_admin/user_admin.service';
import { LOGIN_TYPE, UserAdminJWTPayload } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private userAdminService: UserAdminService,
    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>,
  ) {}

  async validateUserPassword(username: string, password: string) {
    const saltPassword = passwordCrypto(password, this.config.passwordSalt);
    const user = await this.userAdminService.findOneByPassword(username);
    if (user && user.password === saltPassword) {
      return user;
    }
    return void 0;
  }

  async userAdminLogin(usernameOrEmail: string, password: string) {
    let username = usernameOrEmail;
    if (isEmail(usernameOrEmail)) {
      // 如果是邮箱的话，用邮箱换用户名
      const user = await this.userAdminService.findOneByEmail(usernameOrEmail);
      username = user.username;
    }
    const user = await this.validateUserPassword(username, password);
    if (!user) {
      throw new BadRequestException('用户名或密码不正确');
    }

    const payload: UserAdminJWTPayload = {
      username: user.username,
      id: user.id,
      type: LOGIN_TYPE.USER_ADMIN,
      create_date: new Date(),
    };
    return {
      access_token: jwt.sign(payload, this.config.jwtSecret, {
        expiresIn: '7d',
      }),
    };
  }

  async validateJwt(token) {
    return jwt.verify(token, this.config.jwtSecret) as UserAdminJWTPayload &
      jwt.JwtPayload;
  }
}
