import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentTranslationService } from './content_translation.service';
import {
  ContentTranslationUpsertBodyDto,
  ContentTranslationUpsertResponseDto,
  ContentTranslationQueryParamsDto,
  ContentTranslationListResponseDto,
  ContentTranslationMulitUpsertBodyDto,
  ContentTranslationMulitUpsertResponseDto,
  ContentTranslationQueryListDto,
} from './content_translation.dto';
import { successResponse } from '../../utils';
import { RenderViewService } from '../render_view/render_view.service';
import { createPermGroup } from '@/common/common.permission';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';

const MODULE_NAME = '内容翻译';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller('/api/admin/i18n')
export class ContentTranslationController {
  constructor(
    private readonly service: ContentTranslationService,
    private readonly renderViewService: RenderViewService,
  ) {}

  @Post('/save')
  @ApiBody({ type: ContentTranslationUpsertBodyDto })
  @AdminRoleGuard(createPerm('admin:content_translation:upsert', `新增或更新${MODULE_NAME}`))
  @ApiOkResponse({ type: ContentTranslationUpsertResponseDto })
  async upsert(@Body() body: ContentTranslationUpsertBodyDto) {
    const id = await this.service.upsert(body);
    if (body.entity === 'solution') {
      await this.renderViewService.loadGlobal();
    }
    return successResponse(id, '翻译已更新');
  }

  @Post('/list')
  @AdminRoleGuard(createPerm('admin:content_translation:list', `获取${MODULE_NAME}列表`))
  @ApiOkResponse({ type: ContentTranslationListResponseDto })
  @ApiBody({ type: ContentTranslationQueryListDto })
  async pageList(@Body() params: ContentTranslationQueryListDto) {
    const [list, total] = await this.service.queryList(params);
    return successResponse({ list, total });
  }

  @Post('/list/by-entity')
  @AdminRoleGuard(createPerm('admin:content_translation:list', `获取${MODULE_NAME}列表`))
  @ApiOkResponse({ type: ContentTranslationListResponseDto })
  @ApiBody({ type: ContentTranslationQueryParamsDto })
  async list(@Body() params: ContentTranslationQueryParamsDto) {
    const list = await this.service.query(params);
    const total = list.length;
    return successResponse({ list, total });
  }

  @Post('/save/multi')
  @AdminRoleGuard(
    createPerm('admin:content_translation:multi_upsert', `批量新增或更新${MODULE_NAME}`),
  )
  @ApiBody({ type: ContentTranslationMulitUpsertBodyDto })
  @ApiOkResponse({ type: ContentTranslationMulitUpsertResponseDto })
  async multiUpsert(@Body() body: ContentTranslationMulitUpsertBodyDto) {
    const ids = await this.service.mulitUpsert(body.translations);
    // 如果包含 solution 实体，重新加载全局配置
    const hasSolution = body.translations.some((t) => t.entity === 'solution');
    if (hasSolution) {
      await this.renderViewService.loadGlobal();
    }

    return successResponse(ids, '批量翻译已更新');
  }
}
