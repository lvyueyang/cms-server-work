import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { createPermGroup } from '@/common/common.permission';
import { userConfig } from '@/config';
import { VALIDATE_CODE_TYPE } from '@/constants';
import { ResponseResult } from '@/interface';
import { passwordCrypto, successResponse } from '@/utils';
import { AdminLogin } from '../auth/auth.guard';
import { LoggerService } from '../logger/logger.service';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { AdminRoleService } from '../user_admin_role/user_admin_role.service';
import { ValidateCodeByEmailService } from '../validate_code/validate_code.service';
import { UserByAdmin } from './user_admin.decorator';
import {
  UserAdminBindEmailDto,
  UserAdminCreateDto,
  UserAdminCreateRootDto,
  UserAdminFileUploadDto,
  UserAdminForgetPasswordDto,
  UserAdminIdResponseDto,
  UserAdminInfo,
  UserAdminInfoResponseDto,
  UserAdminListResponseDto,
  UserAdminParamsInfoDto,
  UserAdminQueryListDto,
  UserAdminUpdateDto,
  UserAdminUpdatePasswordDto,
  UserAdminUpdateRolesDto,
} from './user_admin.dto';
import { UserAdminService } from './user_admin.service';

const MOD_NAME = '管理后台用户';
const createPerm = createPermGroup(MOD_NAME);

@ApiTags(MOD_NAME)
@Controller('/api/admin/')
export class UserAdminController {
  constructor(
    private logger: LoggerService,
    private services: UserAdminService,
    private roleService: AdminRoleService,
    private validateCodeByEmailService: ValidateCodeByEmailService,

    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>
  ) {}

  @Post('/admin-user/list')
  @ApiOkResponse({
    type: UserAdminListResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:user:list', `获取${MOD_NAME}列表`))
  async list(@Body() pagination: UserAdminQueryListDto) {
    const [list, total] = await this.services.findList(pagination);
    return successResponse({ list, total });
  }

  @Post('/admin-user/create')
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:user:crate', `创建${MOD_NAME}`))
  async create(@Body() user: UserAdminCreateDto) {
    const newUser = await this.services.create({
      ...user,
      password: this.passwordCrypto(user.password),
    });
    return successResponse(newUser.id, '创建成功');
  }

  @Post('/admin-user/info')
  @ApiOkResponse({
    type: UserAdminInfoResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:user:info', `获取${MOD_NAME}详情`))
  async detail(@Body() { id }: UserAdminParamsInfoDto) {
    const info = await this.services.findOneById(id);
    return successResponse(info);
  }

  @Post('/admin-user/update')
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:user:update', `修改${MOD_NAME}信息`))
  async update(@Body() { id, cname, avatar }: UserAdminUpdateDto, @UserByAdmin() user: UserAdminInfo) {
    const oldInfo = await this.services.findOneById(id);
    if (oldInfo.id === id && !user.is_root) {
      throw new BadRequestException('超级管理员信息仅能由超级管理员更新');
    }
    await this.services.update(id, {
      cname,
      avatar,
    });
    return successResponse(id, '更新成功');
  }

  @Post('/admin-user/reset-password')
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:user:resetpassword', `重置${MOD_NAME}密码`))
  async resetPassword(@Body() { id, password }: UserAdminUpdatePasswordDto) {
    await this.services.update(id, {
      password: this.passwordCrypto(password),
    });
    return successResponse(id, '更新成功');
  }

  @Post('/admin-user/update/role')
  @ApiOkResponse({
    type: ResponseResult,
  })
  @AdminRoleGuard(createPerm('admin:user:update_role', `更新${MOD_NAME}角色`))
  async updateRoles(@Body() { roles, id }: UserAdminUpdateRolesDto) {
    const roleList = await this.roleService.findByIds(roles);
    await this.services.updateRoles(id, roleList);
    return successResponse(id, '更新成功');
  }

  @Get('/userinfo')
  @ApiOperation({ summary: '登录者用户信息' })
  @ApiOkResponse({
    type: UserAdminInfoResponseDto,
  })
  @AdminLogin()
  async userInfo(@UserByAdmin() user: UserAdminInfo) {
    return successResponse(user);
  }

  @Post('/forget-password')
  @ApiOperation({ summary: '忘记密码' })
  @ApiOkResponse({
    type: UserAdminInfoResponseDto,
  })
  async forgetPassword(@Body() body: UserAdminForgetPasswordDto) {
    const user = await this.services.findOneByEmail(body.email);
    const [, err] = await this.validateCodeByEmailService.validateCode({
      email: user.email,
      type: VALIDATE_CODE_TYPE.ADMIN_USER_FORGET_PASSWORD,
      code: body.code,
    });
    if (err) {
      throw new BadRequestException('验证码错误');
    }

    await this.services.update(user.id, {
      password: this.passwordCrypto(body.password),
    });
    return successResponse(user, '密码重置成功');
  }

  // 邮箱换绑
  @Post('/user/bind-email')
  @ApiOkResponse({
    type: ResponseResult,
  })
  @AdminLogin()
  async bindEmail(@Body() body: UserAdminBindEmailDto, @UserByAdmin() user: UserAdminInfo) {
    if (user.email === body.new_email) {
      throw new BadRequestException('新邮箱不能与旧邮箱相同');
    }
    // 验证旧邮箱验证码
    const [, err] = await this.validateCodeByEmailService.validateCode({
      email: user.email,
      type: VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_OLD,
      code: body.old_email_code,
    });
    if (err) {
      throw new BadRequestException('旧邮箱验证码错误', err);
    }
    // 验证新邮箱验证码
    const [, err2] = await this.validateCodeByEmailService.validateCode({
      email: body.new_email,
      type: VALIDATE_CODE_TYPE.ADMIN_USER_BIND_EMAIL_NEW,
      code: body.new_email_code,
    });
    if (err2) {
      throw new BadRequestException('新邮箱验证码错误', err2);
    }
    2;
    // 新邮箱是否已被绑定
    const existUser = await this.services.findOne({ email: body.new_email });
    if (existUser) {
      throw new BadRequestException('新邮箱已被绑定');
    }
    // 更新用户邮箱
    await this.services.update(user.id, {
      email: body.new_email,
    });
    return successResponse(user.id, '邮箱换绑成功');
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    type: UserAdminFileUploadDto,
  })
  @ApiOkResponse({
    type: ResponseResult<string>,
  })
  @AdminRoleGuard(createPerm('admin:user:uploadfile', `${MOD_NAME}文件上传`))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UserByAdmin() user: UserAdminInfo, @UploadedFile() file: Express.Multer.File) {
    const dir_path = `adminfile/${user.id}`;
    try {
      const upload = await this.services.uploadLocal(file, dir_path);
      return successResponse(upload);
    } catch (e: any) {
      this.logger.error('文件上传失败', e);
      throw new InternalServerErrorException();
    }
  }

  @Post('/init-root-user-admin')
  @ApiOperation({ summary: '初始化超级管理员用户' })
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  async initRootUser(@Body() { cname, password, username, email }: UserAdminCreateRootDto) {
    const user = await this.services.createRootUser({
      cname,
      username,
      password: this.passwordCrypto(password),
      email,
    });
    return successResponse(user.id, '超管用户创建成功');
  }

  passwordCrypto(password: string) {
    if (!this.config.passwordSalt) {
      throw new Error('密码盐未配置');
    }
    return passwordCrypto(password, this.config.passwordSalt);
  }
}
