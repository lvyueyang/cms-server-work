import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';
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
import Lang from '@/common/lang.decorator';
import { ContentLang } from '@/constants';

const MODULE_NAME = '新闻';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class NewsController {
  constructor(private services: NewsService) {}

  @Get('/news')
  @RenderView()
  async list(@Query() { current = 1 }: { current: number }, @Lang() lang: ContentLang) {
    const limit = 20;
    const [list, total] = await this.services.findList(
      {
        current,
        page_size: limit,
        order_key: 'recommend',
        order_type: 'DESC',
      },
      lang,
    );
    const max = total / limit;
    const next = current < max ? current + 1 : 0;
    const prev = current > 1 ? current - 1 : 0;

    const dataList = list.map((item) => ({
      ...item,
      create_date: dayjs(item.push_date || item.create_date).format('YYYY / MM / DD'),
    }));

    return new RenderViewResult({
      render() {
        return (
          <div>
            <h1>新闻列表</h1>
            <ul>
              {dataList.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/news/${item.id}`}>{item.title}</a>
                    <span>{item.create_date}</span>
                  </li>
                );
              })}
            </ul>
            <div>
              {!!prev && <a href={`/news?current=${prev}`}>上一页</a>}
              {!!next && <a href={`/news?current=${next}`}>下一页</a>}
            </div>
          </div>
        );
      },
    });
  }

  @Get('/news/:id')
  @RenderView()
  async detail(@Param() { id }: { id: number }, @Lang() lang: ContentLang) {
    const { current, next, prev } = await this.services.findNextAndPrev(id, lang);
    const pageData = {
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
    return new RenderViewResult({
      title: pageData.info.title,
      layout: 'base',
      render({ t }) {
        return (
          <div>
            <h1>
              {t('新闻详情')}：{pageData.info.title}
            </h1>
            <hr />
            <div>{pageData.info.desc}</div>
            <div>{dayjs(pageData.info?.push_date).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div dangerouslySetInnerHTML={{ __html: pageData.info.content }}></div>
            <hr />
            <div>
              {!!prev && (
                <div>
                  <a href={`/news/${pageData.prev?.id}`}>上一篇:{pageData.prev?.title}</a>
                </div>
              )}
              {!!next && (
                <div>
                  <a href={`/news/${pageData.next?.id}`}>下一篇:{pageData.next?.title}</a>
                </div>
              )}
            </div>
          </div>
        );
      },
    });
  }

  @Post('/api/admin/news/list')
  @ApiOkResponse({
    type: NewsListResponseDto,
  })
  @ApiBody({ type: NewsQueryListDto })
  @AdminRoleGuard(createPerm('admin:news:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: NewsQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/news/info')
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: NewsByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/news/create')
  @ApiOkResponse({
    type: NewsDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: NewsCreateDto, @User() user) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/news/update')
  @ApiOkResponse({
    type: NewsDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:news:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: NewsUpdateDto) {
    await this.services.update(data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/news/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:news:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: NewsByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
