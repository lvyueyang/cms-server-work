import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import {
  WebhookTransByIdParamDto,
  WebhookTransCreateDto,
  WebhookTransDetailIdResponseDto,
  WebhookTransDetailResponseDto,
  WebhookTransListResponseDto,
  WebhookTransQueryListDto,
  WebhookTransSendQueryDto,
  WebhookTransUpdateDto,
} from './webhook_trans.dto';
import { WebhookTransService } from './webhook_trans.service';
import { createPermGroup } from '@/common/common.permission';

const MOD_NAME = 'Webhook中转';
const createPerm = createPermGroup(MOD_NAME);

@ApiTags(MOD_NAME)
@Controller()
export class WebhookTransController {
  constructor(private services: WebhookTransService) {}

  @Get('/api/admin/webhook_trans')
  @ApiOkResponse({
    type: WebhookTransListResponseDto,
  })
  @ApiBody({ type: WebhookTransQueryListDto })
  @AdminRoleGuard(createPerm('admin:webhook_trans:list', `获取${MOD_NAME}列表`))
  async apiList(@Query() query: WebhookTransQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/webhook_trans/:id')
  @ApiOperation({ summary: 'Webhook中转详情' })
  @ApiOkResponse({
    type: WebhookTransDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:webhook_trans:info', `${MOD_NAME}详情`))
  async apiDetail(@Param() { id }: WebhookTransByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/webhook_trans/send')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook中转调用' })
  async send(@Query() query: WebhookTransSendQueryDto, @Body() data: any) {
    const key = query.key;
    const res = await this.services.send(key, data);
    return res;
  }

  @Post('/api/admin/webhook_trans')
  @ApiOkResponse({
    type: WebhookTransDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:webhook_trans:create', `创建${MOD_NAME}`))
  async apiCreate(@Body() data: WebhookTransCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/webhook_trans/:id')
  @ApiOkResponse({
    type: WebhookTransDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:webhook_trans:update', `修改${MOD_NAME}`))
  async apiUpdate(@Param() { id }: WebhookTransByIdParamDto, @Body() data: WebhookTransUpdateDto) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/webhook_trans/:id')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:webhook_trans:delete', `删除${MOD_NAME}`))
  async apiDelete(@Param() { id }: WebhookTransByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
