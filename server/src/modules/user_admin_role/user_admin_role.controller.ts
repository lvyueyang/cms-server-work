import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_PERMISSION_CODE, createPermGroup } from '@/common/common.permission';
import { successResponse } from '@/utils';
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
import { AdminRoleService } from './user_admin_role.service';

const MOD_NAME = '管理后台角色';
const createPerm = createPermGroup(MOD_NAME);

@ApiTags(MOD_NAME)
@Controller()
export class AdminRoleController {
  constructor(private readonly service: AdminRoleService) {}

  @Post('/api/admin/role')
  @ApiOkResponse({
    type: AdminRoleIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:role:create', `创建${MOD_NAME}`))
  async create(@Body() data: AdminRoleCreateDto) {
    const res = await this.service.create(data);
    return successResponse(res.id);
  }

  @Get('/api/admin/role')
  @ApiOkResponse({
    type: AdminRoleListResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:role:list', `获取${MOD_NAME}列表`))
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
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:role:info', `获取${MOD_NAME}详情`))
  async findOne(@Param() { id }: AdminRoleParamsInfoDto) {
    const res = await this.service.findOneById(Number(id));
    return successResponse(res);
  }

  @Put('/api/admin/role/:id')
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:role:update', `修改${MOD_NAME}信息`))
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
  @ApiOkResponse({
    type: AdminRoleInfoResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:role:code:update', `修改${MOD_NAME}权限码`))
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
  @AdminRoleGuard(createPerm('admin:role:delete', `删除${MOD_NAME}`))
  async remove(@Param() { id }: AdminRoleParamsInfoDto) {
    await this.service.remove(Number(id));
    return successResponse(id);
  }
}
