import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import {
  SystemConfigByIdParamDto,
  SystemConfigCreateDto,
  SystemConfigDetailIdResponseDto,
  SystemConfigDetailResponseDto,
  SystemConfigListResponseDto,
  SystemConfigQueryListDto,
  SystemConfigUpdateDto,
} from './system_config.dto';
import { SystemConfigService } from './system_config.service';
import { createPermGroup } from '@/common/common.permission';
import Lang from '@/common/lang.decorator';
import { ContentLang } from '@/constants';

const MODULE_NAME = '系统配置';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class SystemConfigController {
  constructor(private services: SystemConfigService) {}

  @Post('/api/admin/system_config/list')
  @ApiOkResponse({
    type: SystemConfigListResponseDto,
  })
  @ApiBody({ type: SystemConfigQueryListDto })
  @AdminRoleGuard(createPerm('admin:system_config:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: SystemConfigQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/system_config/info')
  @ApiOkResponse({
    type: SystemConfigDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_config:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: SystemConfigByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/system_config/create')
  @ApiOkResponse({
    type: SystemConfigDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_config:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: SystemConfigCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/system_config/update')
  @ApiOkResponse({
    type: SystemConfigDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_config:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: SystemConfigUpdateDto) {
    await this.services.update(data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/system_config/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:system_config:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: SystemConfigByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
