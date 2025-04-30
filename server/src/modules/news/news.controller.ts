import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { RenderView } from '../render_view/render_view.decorator';
import {
  NewsByIdParamDto,
  NewsCreateDto,
  NewsDetailIdResponseDto,
  NewsDetailResponseDto,
  NewsListResponseDto,
  NewsQueryListDto,
  NewsUpdateDto,
} from './news.dto';
import { NewsService } from './news.service';
import { createPermGroup } from '@/common/common.permission';

const MODULE_NAME = '新闻';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class NewsController {
  constructor(private services: NewsService) {}

  @RenderView('/news')
  async list(@Query() { current = 1 }: { current: number }) {
    const limit = 20;
    const [list, total] = await this.services.findList({
      current,
      page_size: limit,
      order_key: 'recommend',
      order_type: 'DESC',
    });
    const max = total / limit;
    const next = current < max ? current + 1 : 0;
    const prev = current > 1 ? current - 1 : 0;
    return {
      list: list.map((item) => ({
        ...item,
        create_date: dayjs(item.push_date || item.create_date).format('YYYY / MM / DD'),
      })),
      next,
      prev,
    };
  }

  @RenderView('/news/:id')
  async detail(@Param() { id }: { id: number }) {
    const { current, next, prev } = await this.services.findNextAndPrev(id);
    return {
      info: {
        ...current,
        create_date: dayjs(current.create_date).format('YYYY-MM-DD HH:mm'),
      },
      next: next
        ? {
            title: next.title,
            id: next.id,
          }
        : null,
      prev: prev
        ? {
            title: prev.title,
            id: prev.id,
          }
        : null,
    };
  }

  @Get('/api/admin/news')
  @ApiOkResponse({
    type: NewsListResponseDto,
  })
  @ApiBody({ type: NewsQueryListDto })
  @AdminRoleGuard(createPerm('admin:news:list', `获取${MODULE_NAME}列表`))
  async apiList(@Query() query: NewsQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/news/:id')
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Param() { id }: NewsByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/news')
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: NewsCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/news/:id')
  @ApiOkResponse({
    type: NewsDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Param() { id }: NewsByIdParamDto, @Body() data: NewsUpdateDto) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/news/:id')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:news:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Param() { id }: NewsByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
