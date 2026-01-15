import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ExportParamsDto, ResponseResult } from '@/interface';
import { exportData } from '@/utils/exportData';
import { successResponse } from '../../utils';
import { RenderViewService } from '../render_view/render_view.service';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import {
  ContentTranslationByIdParamDto,
  ContentTranslationListResponseDto,
  ContentTranslationMulitUpsertBodyDto,
  ContentTranslationMulitUpsertResponseDto,
  ContentTranslationQueryListDto,
  ContentTranslationQueryParamsDto,
  ContentTranslationUpdateDto,
  ContentTranslationUpsertBodyDto,
  ContentTranslationUpsertResponseDto,
} from './content_translation.dto';
import { ContentTranslationService, transEntityId } from './content_translation.service';

const MODULE_NAME = '内容翻译';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller('/api/admin/i18n')
export class ContentTranslationController {
  constructor(
    private readonly service: ContentTranslationService,
    private readonly renderViewService: RenderViewService
  ) {}

  @Post('/save')
  @ApiBody({ type: ContentTranslationUpsertBodyDto })
  @AdminRoleGuard(createPerm('admin:content_translation:upsert', `新增或更新${MODULE_NAME}`))
  @ApiOkResponse({ type: ContentTranslationUpsertResponseDto })
  async upsert(@Body() body: ContentTranslationUpsertBodyDto) {
    const id = await this.service.upsert({
      ...body,
      entityId: transEntityId(body.entityId),
    });
    if (body.entity === 'solution') {
      await this.renderViewService.loadGlobal();
    }
    return successResponse(id, '翻译已更新');
  }

  @Post('/export')
  @AdminRoleGuard(createPerm('admin:content_translation:export', `导出${MODULE_NAME}`))
  @ApiOkResponse({ type: ResponseResult<null> })
  @ApiBody({ type: ExportParamsDto })
  async export(@Body() body: ExportParamsDto) {
    const dataList = await this.service.findAll();
    return exportData({
      dataList,
      exportType: body.export_type,
      repository: this.service.repository,
      name: MODULE_NAME,
    });
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
  @AdminRoleGuard(createPerm('admin:content_translation:multi_upsert', `批量新增或更新${MODULE_NAME}`))
  @ApiBody({ type: ContentTranslationMulitUpsertBodyDto })
  @ApiOkResponse({ type: ContentTranslationMulitUpsertResponseDto })
  async multiUpsert(@Body() body: ContentTranslationMulitUpsertBodyDto) {
    const ids = await this.service.mulitUpsert(
      body.translations.map((t) => ({
        ...t,
        entityId: transEntityId(t.entityId),
      }))
    );
    // 如果包含 solution 实体，重新加载全局配置
    const hasSolution = body.translations.some((t) => t.entity === 'solution');
    if (hasSolution) {
      await this.renderViewService.loadGlobal();
    }

    return successResponse(ids, '批量翻译已更新');
  }

  @Post('/update/byid')
  @AdminRoleGuard(createPerm('admin:content_translation:update', `更新${MODULE_NAME}`))
  @ApiOkResponse({ type: ResponseResult<null> })
  @ApiBody({ type: ContentTranslationUpdateDto })
  async updateValue(@Body() params: ContentTranslationUpdateDto) {
    await this.service.updateValue(params.id, params.value);
    return successResponse(null, '翻译已更新');
  }

  @Post('/delete')
  @AdminRoleGuard(createPerm('admin:content_translation:delete', `删除${MODULE_NAME}`))
  @ApiOkResponse({ type: ResponseResult<null> })
  @ApiBody({ type: ContentTranslationByIdParamDto })
  async delete(@Body() params: ContentTranslationByIdParamDto) {
    await this.service.delete(params.id);
    return successResponse(null, '翻译已删除');
  }
}
