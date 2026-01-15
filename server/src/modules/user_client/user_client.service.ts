import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { userConfig } from '@/config';
import { Pagination } from '@/interface';
import { paginationTransform } from '@/utils/whereTransform';
import { LOGIN_TYPE, UserJWTPayload } from '../auth/auth.interface';
import { UserClient } from './user_client.entity';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>,

    @InjectRepository(UserClient)
    private repository: Repository<UserClient>
  ) {}

  findAll(): Promise<UserClient[]> {
    return this.repository.find();
  }

  findList(pagination: Pagination) {
    return this.repository.findAndCount({
      ...paginationTransform(pagination),
    });
  }
  async findOne(id: string) {
    const info = await this.repository.findOneBy({ id });
    if (!info) {
      throw new Error('用户不存在');
    }
    return info;
  }
  create(data: Pick<UserClient, 'cname' | 'username' | 'email' | 'password' | 'phone'>) {
    return this.repository.create({
      cname: data.cname,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
  }
  async usePhoneCreate(phone: string, password: string) {
    const info = await this.repository.findOneBy({ phone });
    if (info) {
      throw new Error('手机号已存在');
    }
    return await this.repository.save({
      phone,
      username: phone,
      password,
      cname: '用户' + phone.substring(7),
    });
  }
  async findOneByPhone(phone: string) {
    const info = await this.repository.findOneBy({ phone });
    return info;
  }

  update(id: number, user: Pick<UserClient, 'cname' | 'email' | 'password' | 'phone'>) {
    return this.repository.update(id, user);
  }
  updatePassword(id: string, password: string) {
    return this.repository.update(id, { password });
  }

  // 验证密码
  async validatePassword(phone: string, password: string) {
    const user = await this.repository.findOneBy({ phone });
    if (!user) {
      throw new BadRequestException('手机号不存在');
    }
    if (user.password !== password) {
      throw new BadRequestException('密码错误');
    }
    return user;
  }

  // 登录
  async userLogin(user: UserClient) {
    const payload: UserJWTPayload = {
      username: user.username,
      id: user.id,
      type: LOGIN_TYPE.USER_CLIENT,
      create_date: new Date(),
    };
    if (!this.config.jwtClientSecret) {
      throw new BadRequestException('JWT 密钥不存在, 请配置');
    }
    return {
      access_token: jwt.sign(payload, this.config.jwtClientSecret, {
        expiresIn: '30d',
      }),
      user,
    };
  }
}
