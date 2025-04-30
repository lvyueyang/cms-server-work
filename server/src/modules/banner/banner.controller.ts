import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { User } from '../user_admin/user-admin.decorator';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { successResponse } from '../../utils';
import {
  BannerByIdParamDto,
  BannerCreateDto,
  BannerDetailIdResponseDto,
  BannerDetailResponseDto,
  BannerListResponseDto,
  BannerQueryListDto,
  BannerUpdateDto,
} from './banner.dto';
import { BannerService } from './banner.service';
import { createPermGroup } from '@/common/common.permission';

const MODULE_NAME = '广告';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags('广告')
@Controller()
export class BannerController {
  constructor(private services: BannerService) {}

  @Get('/api/admin/banner')
  @ApiOkResponse({
    type: BannerListResponseDto,
  })
  @ApiBody({ type: BannerQueryListDto })
  @AdminRoleGuard(createPerm('admin:banner:list', `获取${MODULE_NAME}列表`))
  async apiList(@Query() query: BannerQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/banner/:id')
  @ApiOperation({ summary: '广告详情' })
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Param() { id }: BannerByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/banner')
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: BannerCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/banner/:id')
  @ApiOkResponse({
    type: BannerDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Param() { id }: BannerByIdParamDto, @Body() data: BannerUpdateDto) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/banner/:id')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:banner:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Param() { id }: BannerByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
