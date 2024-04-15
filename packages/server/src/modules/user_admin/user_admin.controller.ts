import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { userConfig } from '@/config';
import { USER_PONIT_TYPE, VALIDATE_CODE_TYPE } from '@/constants';
import { ResponseResult } from '@/interface';
import { passwordCrypto, successResponse } from '@/utils';
import { AdminLogin } from '../auth/auth.guard';
import { LoggerService } from '../logger/logger.service';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { AdminRoleService } from '../user_admin_role/user_admin_role.service';
import { ValidateCodeService } from '../validate_code/validate_code.service';
import {
  UserAdminCreateDto,
  UserAdminCreateRootDto,
  UserAdminFileUploadDto,
  UserAdminForgetPasswordDto,
  UserAdminIdResponseDto,
  UserAdminInfoResponseDto,
  UserAdminListResponseDto,
  UserAdminParamsInfoDto,
  UserAdminQueryListDto,
  UserAdminUpdateDto,
  UserAdminUpdatePasswordDto,
  UserAdminUpdateRolesDto,
} from './user_admin.dto';
import { User } from './user-admin.decorator';
import { PERMISSION } from './user_admin.permission';
import { UserAdminService } from './user_admin.service';

@ApiTags('管理后台用户相关')
@Controller('/api/admin/')
export class UserAdminController {
  constructor(
    private logger: LoggerService,
    private services: UserAdminService,
    private roleService: AdminRoleService,
    private validateCodeServices: ValidateCodeService,

    @Inject(userConfig.KEY)
    private config: ConfigType<typeof userConfig>,
  ) {}

  @Get('/admin-user')
  @ApiOperation({ summary: '用户列表' })
  @ApiOkResponse({
    type: UserAdminListResponseDto,
  })
  @AdminRoleGuard(PERMISSION.LIST)
  async list(@Query() pagination: UserAdminQueryListDto) {
    const [list, total] = await this.services.findList(pagination);
    return successResponse({ list, total });
  }

  @Post('/admin-user')
  @ApiOperation({ summary: '用户新增' })
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.CREATE)
  async create(@Body() user: UserAdminCreateDto) {
    const newUser = await this.services.create({
      ...user,
      password: this.passwordCrypto(user.password),
    });
    return successResponse(newUser.id, '创建成功');
  }

  @Get('/admin-user/:id')
  @ApiOperation({ summary: '用户详情' })
  @ApiOkResponse({
    type: UserAdminInfoResponseDto,
  })
  @AdminRoleGuard(PERMISSION.INFO)
  async detail(@Param() { id }: UserAdminParamsInfoDto) {
    const info = await this.services.findOneById(id);
    return successResponse(info);
  }

  @Put('/admin-user/:id')
  @ApiOperation({ summary: '用户更新' })
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE)
  async update(@Param() { id }: UserAdminParamsInfoDto, @Body() { cname }: UserAdminUpdateDto) {
    await this.services.update(id, {
      cname,
    });
    return successResponse(id, '更新成功');
  }

  @Post('/admin-user/reset-password/:id')
  @ApiOperation({ summary: '密码重置' })
  @ApiOkResponse({
    type: UserAdminIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.PASSWORD_RESET)
  async resetPassword(
    @Param() { id }: UserAdminParamsInfoDto,
    @Body() { password }: UserAdminUpdatePasswordDto,
  ) {
    await this.services.update(id, {
      password: this.passwordCrypto(password),
    });
    return successResponse(id, '更新成功');
  }

  @Put('/admin-user/:id/role')
  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({
    type: ResponseResult,
  })
  @AdminRoleGuard(PERMISSION.ROLE_UPDATE)
  async updateRoles(
    @Param() { id }: UserAdminParamsInfoDto,
    @Body() { roles }: UserAdminUpdateRolesDto,
  ) {
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
  async userInfo(@User() user) {
    return successResponse(user);
  }

  @Post('/forget-password')
  @ApiOperation({ summary: '忘记密码' })
  @ApiOkResponse({
    type: UserAdminInfoResponseDto,
  })
  async forgetPassword(@Body() body: UserAdminForgetPasswordDto) {
    const user = await this.services.findOneByEmail(body.email);

    const [result] = await this.validateCodeServices.validate({
      code_type: VALIDATE_CODE_TYPE.FORGET_PASSWORD,
      code: body.code,
      user_id: user.id,
      point_type: USER_PONIT_TYPE.AMDIN,
    });
    if (!result) {
      throw new BadRequestException('验证码无效');
    }
    await this.services.update(user.id, {
      password: this.passwordCrypto(body.password),
    });
    return successResponse(user, '密码重置成功');
  }

  @Post('/upload')
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    type: UserAdminFileUploadDto,
  })
  @ApiOkResponse({
    type: ResponseResult<string>,
  })
  @AdminRoleGuard(PERMISSION.UPLOAD_FILE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@User() user, @UploadedFile() file: Express.Multer.File) {
    const dir_path = `adminfile/${user.id}`;
    try {
      const upload = await this.services.uploadLocal(file, dir_path);
      return successResponse(upload);
    } catch (e) {
      console.log(e);
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
    return passwordCrypto(password, this.config.passwordSalt);
  }
}
