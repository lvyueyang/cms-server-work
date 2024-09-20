import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { s3AccountConfig } from '@/config';
import { Pagination } from '@/interface';
import { getUploadFileDirPath } from '@/utils';
import { paginationTransform } from '@/utils/whereTransform';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AdminRole } from '../user_admin_role/user_admin_role.entity';
import { UserAdmin } from './user_admin.entity';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(UserAdmin)
    private repository: Repository<UserAdmin>,

    @Inject(s3AccountConfig.KEY)
    private s3Config: ConfigType<typeof s3AccountConfig>,
  ) {}

  findList(pagination: Pagination) {
    return this.repository.findAndCount({
      ...paginationTransform(pagination),
      relations: ['roles'],
    });
  }
  private async findOne(where: FindOptionsWhere<UserAdmin>) {
    const res = await this.repository.find({
      where,
      relations: ['roles'],
    });
    return res[0];
  }
  findOneById(id: number) {
    return this.findOne({ id });
  }
  async findOneByEmail(email: string) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }
  findOneByUsername(username: string) {
    return this.findOne({ username });
  }
  async findOneByPassword(username: string) {
    const res = await this.repository.find({
      where: { username },
      select: ['password', 'cname', 'username', 'id', 'email'],
      relations: ['roles'],
    });
    return res[0];
  }
  async create(user: Pick<UserAdmin, 'cname' | 'username' | 'password' | 'email'>) {
    const isExisted = await this.repository.findOne({
      where: [{ username: user.username }, { email: user.email }],
    });

    if (isExisted) {
      let msg = '用户已存在';
      if (isExisted.email === user.email) {
        msg = '邮箱已被使用';
      }
      throw new BadRequestException(msg);
    }
    return this.repository.save({
      cname: user.cname,
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
  async createRootUser(user: Pick<UserAdmin, 'cname' | 'username' | 'password' | 'email'>) {
    // 判断是否存在超管用户
    const rootUser = await this.repository.findOneBy({ is_root: true });
    if (rootUser) {
      throw new UnauthorizedException('超管用户已存在禁止重复创建');
    }
    return this.repository.save({ ...user, is_root: true });
  }
  async update(
    id: number,
    {
      cname,
      password,
      email,
      out_login_date,
    }: Partial<Pick<UserAdmin, 'cname' | 'password' | 'email' | 'out_login_date'>>,
  ) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('用户不存在', 'user not found');
    }
    return this.repository.update(isExisted.id, {
      cname,
      password,
      email,
      out_login_date,
    });
  }
  async updateRoles(id: number, roles: AdminRole[]) {
    const user = await this.repository.findOneBy({
      id,
    });
    if (!user) {
      throw new BadRequestException('用户不存在', 'user not found');
    }
    user.roles = roles;
    return this.repository.save(user);
  }

  createClient() {
    const client = new S3Client({
      credentials: {
        accessKeyId: this.s3Config.key,
        secretAccessKey: this.s3Config.secret,
      },
      endpoint: this.s3Config.address,
      region: 'us-east-1',
      forcePathStyle: true,
    });
    return client;
  }

  async uploadToS3(file: Express.Multer.File, dirPath: string, filename?: string) {
    const Key = dirPath + `/${filename || uuid()}`;
    const Upload = new PutObjectCommand({
      Bucket: this.s3Config.bucket,
      Body: file.buffer,
      Key,
      ContentType: file.mimetype,
      Metadata: {
        originalname: file.originalname,
      },
    });
    const client = this.createClient();
    try {
      await client.send(Upload);
      client.destroy();
      return this.s3Config.address + '/' + this.s3Config.bucket + '/' + Key;
    } catch (e) {
      client.destroy();
      throw e;
    }
  }

  async uploadLocal(file: Express.Multer.File, dirPath: string, filename?: string) {
    const Key = filename || `${uuid()}.${file.originalname.split('.').reverse()[0]}`;
    const dir = path.join(getUploadFileDirPath(), dirPath);
    try {
      await fs.promises.access(dir);
    } catch (e) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(path.join(dir, Key), file.buffer);
    return `/uploadfile/${dirPath}/${Key}`;
  }
}
