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
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { ResponseResult } from 'src/interface';
import { User } from 'src/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from 'src/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from 'src/utils';
import { NunjucksService } from '../nunjucks/nunjucks.service';
import {
  NewsByIdParamDto,
  NewsCreateDto,
  NewsDetailIdResponseDto,
  NewsDetailResponseDto,
  NewsListResponseDto,
  NewsQueryListDto,
  NewsUpdateDto,
} from './news.dto';
import { PERMISSION } from './news.permission';
import { NewsService } from './news.service';

@ApiTags('新闻中心')
@Controller()
export class NewsController {
  constructor(
    private services: NewsService,
    private renderService: NunjucksService,
  ) {}

  @Get('/news')
  @ApiExcludeEndpoint()
  async list(@Query() { current = 1 }: { current: number }) {
    const limit = 20;
    const [list, total] = await this.services.findList({
      current,
      page_size: limit,
    });
    const max = total / limit;
    const next = current < max ? current + 1 : 0;
    const prev = current > 1 ? current - 1 : 0;
    return this.renderService.render('news', {
      list: list.map((item) => ({
        ...item,
        create_date: dayjs(item.create_date).format('YYYY / MM / DD'),
      })),
      next,
      prev,
    });
  }

  @Get('/news/:id')
  @ApiExcludeEndpoint()
  async detail(@Param() { id }: { id: number }) {
    const { current, next, prev } = await this.services.findNextAndPrev(id);
    return this.renderService.render('news_detail', {
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
    });
  }

  @Get('/api/admin/news')
  @ApiOperation({ summary: '新闻中心列表' })
  @ApiOkResponse({
    type: NewsListResponseDto,
  })
  @ApiBody({ type: NewsQueryListDto })
  @AdminRoleGuard(PERMISSION.LIST)
  async apiList(@Query() query: NewsQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Get('/api/admin/news/:id')
  @ApiOperation({ summary: '新闻中心详情' })
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.INFO)
  async apiDetail(@Param() { id }: NewsByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/news')
  @ApiOperation({ summary: '新增新闻中心' })
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(PERMISSION.CREATE)
  async apiCreate(@Body() data: NewsCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Put('/api/admin/news/:id')
  @ApiOperation({ summary: '修改新闻中心' })
  @ApiOkResponse({
    type: NewsDetailIdResponseDto,
  })
  @AdminRoleGuard(PERMISSION.UPDATE)
  async apiUpdate(
    @Param() { id }: NewsByIdParamDto,
    @Body() data: NewsUpdateDto,
  ) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Delete('/api/admin/news/:id')
  @ApiOperation({ summary: '删除新闻中心' })
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(PERMISSION.DELETE)
  async apiDelete(@Param() { id }: NewsByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
