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
import { PERMISSION } from './banner.permission';
import { BannerService } from './banner.service';

@ApiTags('广告')
@Controller()
export class BannerController {
  constructor(private services: BannerService) {}

  @Get('/api/admin/banner')
  @ApiOperation({ summary: '广告列表' })
  @ApiOkResponse({
    type: BannerListResponseDto,
  })
  @ApiBody({ type: BannerQueryListDto })
  @AdminRoleGuard(PERMISSION.LIST)
  async apiList(@Query() query: BannerQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/banner/:id')
  @ApiOperation({ summary: '广告详情' })
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.INFO)
  async apiDetail(@Param() { id }: BannerByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/banner')
  @ApiOperation({ summary: '新增广告' })
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.CREATE)
  async apiCreate(@Body() data: BannerCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/banner/:id')
  @ApiOperation({ summary: '修改广告' })
  @ApiOkResponse({
    type: BannerDetailIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE)
  async apiUpdate(@Param() { id }: BannerByIdParamDto, @Body() data: BannerUpdateDto) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/banner/:id')
  @ApiOperation({ summary: '删除广告' })
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(PERMISSION.DELETE)
  async apiDelete(@Param() { id }: BannerByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
