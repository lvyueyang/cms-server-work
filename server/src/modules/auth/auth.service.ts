import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { isEmail } from 'class-validator';
import dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import { userConfig } from '@/config';
import { passwordCrypto } from '@/utils';
import { LoggerService } from '../logger/logger.service';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { UserAdminService } from '../user_admin/user_admin.service';
import { UserClient } from '../user_client/user_client.entity';
import { UserClientService } from '../user_client/user_client.service';
import { LOGIN_TYPE, UserJWTPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userAdminService: UserAdminService,
    private userClientService: UserClientService,
    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>,
    private logger: LoggerService
  ) {}

  async validateUserPassword(username: string, password: string) {
    if (!this.config.passwordSalt) {
      throw new BadRequestException('密码盐不存在, 请配置');
    }
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

    const payload: UserJWTPayload = {
      username: user.username,
      id: user.id,
      type: LOGIN_TYPE.USER_ADMIN,
      create_date: new Date(),
    };
    if (!this.config.jwtSecret) {
      throw new BadRequestException('JWT 密钥不存在, 请配置');
    }
    return {
      access_token: jwt.sign(payload, this.config.jwtSecret, {
        expiresIn: '7d',
      }),
    };
  }
  // 校验管理员用户是否登录
  async userAdminIsLogin({ token }: { token?: string }): Promise<[UserAdmin | null, string | null]> {
    if (!token) {
      return [null, 'token 不存在'];
    }
    try {
      const tokenData = await this.validateAdminJwt(token);
      if (tokenData.type !== LOGIN_TYPE.USER_ADMIN) {
        return [null, 'token 类型错误, 请使用管理员账号'];
      }
      const user = await this.userAdminService.findOneById(tokenData.id as number);
      // 退出登陆逻辑校验
      if (dayjs(tokenData.create_date).isBefore(dayjs(user.out_login_date))) {
        return [null, '身份过期'];
      }
      if (!user) {
        return [null, '身份不存在'];
      }
      return [user, null];
    } catch (e: any) {
      this.logger.error(e?.message || 'AdminUser 身份过期(未知错误)');
      return [null, e?.message || '身份过期(未知错误)'];
    }
  }
  // 校验客户端用户是否登录
  async userClientIsLogin({ token }: { token?: string }): Promise<[UserClient | null, string | null]> {
    if (!token) {
      return [null, 'token 不存在'];
    }
    try {
      const tokenData = await this.validateClientJwt(token);
      if (tokenData.type !== LOGIN_TYPE.USER_CLIENT) {
        return [null, 'token 类型错误, 请使用客户端账号'];
      }
      const user = await this.userClientService.findOne(tokenData.id as string);
      if (!user) {
        return [null, '身份不存在'];
      }
      return [user, null];
    } catch (e: any) {
      this.logger.error(e?.message || 'ClientUser 身份过期(未知错误)');
      return [null, e?.message || '身份过期(未知错误)'];
    }
  }

  async validateAdminJwt(token: string) {
    if (!this.config.jwtSecret) {
      throw new BadRequestException('JWT 密钥不存在, 请配置');
    }
    return jwt.verify(token, this.config.jwtSecret) as unknown as UserJWTPayload & jwt.JwtPayload;
  }

  async validateClientJwt(token: string) {
    if (!this.config.jwtClientSecret) {
      throw new BadRequestException('JWT 密钥不存在, 请配置');
    }
    return jwt.verify(token, this.config.jwtClientSecret) as unknown as UserJWTPayload & jwt.JwtPayload;
  }
}
