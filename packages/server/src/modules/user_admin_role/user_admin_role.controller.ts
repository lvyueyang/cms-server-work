import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_PERMISSION_CODE } from 'src/common/common.permission';
import { successResponse } from 'src/utils';
import { AdminLogin } from '../auth/auth.guard';
import {
  AdminPermissionCodeListResponseDto,
  AdminRoleCreateDto,
  AdminRoleIdResponseDto,
  AdminRoleInfoResponseDto,
  AdminRoleListResponseDto,
  AdminRoleParamsInfoDto,
  AdminRoleQueryListDto,
  AdminRoleUpdateDto,
  AdminRoleUpdatePermissionCodeDto,
} from './user_admin_role.dto';
import { AdminRoleGuard } from './user_admin_role.guard';
import { PERMISSION } from './user_admin_role.permission';
import { AdminRoleService } from './user_admin_role.service';

@ApiTags('管理后台角色')
@Controller()
export class AdminRoleController {
  constructor(private readonly service: AdminRoleService) {}

  @Post('/api/admin/role')
  @ApiOperation({ summary: '创建角色' })
  @ApiOkResponse({
    type: AdminRoleIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.CREATE)
  async create(@Body() data: AdminRoleCreateDto) {
    const res = await this.service.create(data);
    return successResponse(res.id);
  }

  @Get('/api/admin/role')
  @ApiOperation({ summary: '角色列表' })
  @ApiOkResponse({
    type: AdminRoleListResponseDto,
  })
  @AdminRoleGuard(PERMISSION.LIST)
  async findAll(@Query() pagination: AdminRoleQueryListDto) {
    const [list, total] = await this.service.findList(pagination);
    return successResponse({ list, total });
  }

  @Get('/api/admin/role/codes')
  @ApiOperation({ summary: '权限码列表' })
  @ApiOkResponse({
    type: AdminPermissionCodeListResponseDto,
  })
  @AdminLogin()
  async codes() {
    return successResponse(ADMIN_PERMISSION_CODE);
  }

  @Get('/api/admin/role/:id')
  @ApiOperation({ summary: '角色详情' })
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(PERMISSION.INFO)
  async findOne(@Param() { id }: AdminRoleParamsInfoDto) {
    const res = await this.service.findOneById(Number(id));
    return successResponse(res);
  }

  @Put('/api/admin/role/:id')
  @ApiOperation({ summary: '更新角色' })
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE)
  async update(
    @Param() { id }: AdminRoleParamsInfoDto,
    @Body() { name, desc }: AdminRoleUpdateDto,
  ) {
    await this.service.update(Number(id), {
      name,
      desc,
    });
    return successResponse(id);
  }

  @Put('/api/admin/role/:id/codes')
  @ApiOperation({ summary: '更新角色权限码' })
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE_CODE)
  async updateCodes(
    @Param() { id }: AdminRoleParamsInfoDto,
    @Body() { codes }: AdminRoleUpdatePermissionCodeDto,
  ) {
    await this.service.update(Number(id), {
      codes,
    });
    return successResponse(id);
  }

  @Delete('/api/admin/role/:id')
  @ApiOperation({ summary: '删除角色' })
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(PERMISSION.DELETE)
  async remove(@Param() { id }: AdminRoleParamsInfoDto) {
    await this.service.remove(Number(id));
    return successResponse(id);
  }
}
