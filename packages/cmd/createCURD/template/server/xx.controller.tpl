import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExportParamsDto, ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import {
  {{entityName}}ByIdParamDto,
  {{entityName}}CreateDto,
  {{entityName}}DetailIdResponseDto,
  {{entityName}}DetailResponseDto,
  {{entityName}}ListResponseDto,
  {{entityName}}QueryListDto,
  {{entityName}}UpdateDto,
} from './{{name}}.dto';
import { {{entityName}}Service } from './{{name}}.service';
import { createPermGroup } from '@/common/common.permission';
import Lang from '@/common/lang.decorator';
import { ContentLang } from '@/constants';
import { UserAdminInfo } from '@/modules/user_admin/user_admin.dto';
import { exportData } from '@/utils/exportData';

const MODULE_NAME = '{{cname}}';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class {{entityName}}Controller {
  constructor(private services: {{entityName}}Service) {}

  @Post('/api/admin/{{name}}/list')
  @ApiOkResponse({
    type: {{entityName}}ListResponseDto,
  })
  @ApiBody({ type: {{entityName}}QueryListDto })
  @AdminRoleGuard(createPerm('admin:{{name}}:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: {{entityName}}QueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/{{name}}/export')
  @AdminRoleGuard(createPerm('admin:{{name}}:export', `导出${MODULE_NAME}`))
  @ApiOkResponse({ type: ResponseResult<null> })
  @ApiBody({ type: ExportParamsDto })
  async export(@Body() body: ExportParamsDto) {
    const dataList = await this.service.findExportAll();
    return exportData({
      dataList,
      exportType: body.export_type,
      repository: this.service.repository,
      name: MODULE_NAME,
    });
  }

  @Post('/api/admin/{{name}}/info')
  @ApiOkResponse({
    type: {{entityName}}DetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:{{name}}:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: {{entityName}}ByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/{{name}}/create')
  @ApiOkResponse({
    type: {{entityName}}DetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:{{name}}:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: {{entityName}}CreateDto, @User() user: UserAdminInfo) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/{{name}}/update')
  @ApiOkResponse({
    type: {{entityName}}DetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:{{name}}:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: {{entityName}}UpdateDto) {
    await this.services.update(data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/{{name}}/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:{{name}}:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: {{entityName}}ByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
