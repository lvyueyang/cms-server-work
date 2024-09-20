import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
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
import { PERMISSION } from './{{name}}.permission';
import { {{entityName}}Service } from './{{name}}.service';

@ApiTags('{{cname}}')
@Controller()
export class {{entityName}}Controller {
  constructor(private services: {{entityName}}Service) {}

  @Get('/api/admin/{{name}}')
  @ApiOperation({ summary: '{{cname}}列表' })
  @ApiOkResponse({
    type: {{entityName}}ListResponseDto,
  })
  @ApiBody({ type: {{entityName}}QueryListDto })
  @AdminRoleGuard(PERMISSION.LIST)
  async apiList(@Query() query: {{entityName}}QueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/{{name}}/:id')
  @ApiOperation({ summary: '{{cname}}详情' })
  @ApiOkResponse({
    type: {{entityName}}DetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.INFO)
  async apiDetail(@Param() { id }: {{entityName}}ByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/{{name}}')
  @ApiOperation({ summary: '新增{{cname}}' })
  @ApiOkResponse({
    type: {{entityName}}DetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.CREATE)
  async apiCreate(@Body() data: {{entityName}}CreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/{{name}}/:id')
  @ApiOperation({ summary: '修改{{cname}}' })
  @ApiOkResponse({
    type: {{entityName}}DetailIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE)
  async apiUpdate(
    @Param() { id }: {{entityName}}ByIdParamDto,
    @Body() data: {{entityName}}UpdateDto,
  ) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/{{name}}/:id')
  @ApiOperation({ summary: '删除{{cname}}' })
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(PERMISSION.DELETE)
  async apiDelete(@Param() { id }: {{entityName}}ByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
