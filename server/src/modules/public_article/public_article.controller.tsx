import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import Lang from '@/common/lang.decorator';
import { ContentLang, FE_PREFIX } from '@/constants';
import { ResponseResult } from '@/interface';
import { UserByAdmin } from '@/modules/user_admin/user_admin.decorator';
import { UserAdminInfo } from '@/modules/user_admin/user_admin.dto';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { PublicArticleDetailPage } from '@/views';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';
import {
  PublicArticleByIdParamDto,
  PublicArticleCreateDto,
  PublicArticleDetailIdResponseDto,
  PublicArticleDetailResponseDto,
  PublicArticleListResponseDto,
  PublicArticleQueryListDto,
  PublicArticleUpdateDto,
} from './public_article.dto';
import { PublicArticleService } from './public_article.service';

const MODULE_NAME = '开放文章';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class PublicArticleController {
  constructor(private services: PublicArticleService) {}

  @Get('/article/:code')
  @RenderView()
  async detail(@Param() { code }: { code: string }, @Lang() lang: ContentLang) {
    const zhInfo = await this.services.findByCode(code);
    const [info] = await this.services.i18nTrans([zhInfo], lang);
    return new RenderViewResult({
      title: info.title,
      layout: 'base',
      scripts: [],
      styles: [`${FE_PREFIX}/article.css`],
      render() {
        return <PublicArticleDetailPage info={info} />;
      },
    });
  }

  @Post('/api/admin/public_article/list')
  @ApiOkResponse({
    type: PublicArticleListResponseDto,
  })
  @ApiBody({ type: PublicArticleQueryListDto })
  @AdminRoleGuard(createPerm('admin:public_article:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: PublicArticleQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/public_article/info')
  @ApiOkResponse({
    type: PublicArticleDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:public_article:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: PublicArticleByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/public_article/create')
  @ApiOkResponse({
    type: PublicArticleDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:public_article:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: PublicArticleCreateDto, @UserByAdmin() user: UserAdminInfo) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/public_article/update')
  @ApiOkResponse({
    type: PublicArticleDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:public_article:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: PublicArticleUpdateDto) {
    await this.services.update(data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/public_article/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:public_article:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: PublicArticleByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
