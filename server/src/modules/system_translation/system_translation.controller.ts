import { BadRequestException, Body, Controller, Get, Header, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ContentLang } from '@/constants';
import { ExportParamsDto, ResponseResult } from '@/interface';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { exportData } from '@/utils/exportData';
import { RenderViewService } from '../render_view/render_view.service';
import {
  SystemTranslationByIdParamDto,
  SystemTranslationCreateDto,
  SystemTranslationDetailIdResponseDto,
  SystemTranslationDetailResponseDto,
  SystemTranslationListResponseDto,
  SystemTranslationMultiCreateDto,
  SystemTranslationQueryListDto,
  SystemTranslationUpdateDto,
} from './system_translation.dto';
import { SystemTranslationService } from './system_translation.service';

const MODULE_NAME = '国际化';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class SystemTranslationController {
  constructor(private services: SystemTranslationService, private renderViewService: RenderViewService) {}

  @Get('/locals/:lang')
  @Header('Content-Type', 'text/javascript')
  async langJs(@Param() { lang }: { lang: ContentLang }) {
    const l = lang.replace(/\.js/gi, '');
    if (!Object.values(ContentLang).includes(l as ContentLang)) {
      throw new BadRequestException('语言不存在');
    }
    const list = await this.services.findAll(l as ContentLang);
    const kvs: Record<string, string> = {};
    list.forEach((i) => {
      kvs[i.key] = i.value;
    });
    return `;(function() {
      window.locals = {};
      window.locals['${l}'] = ${JSON.stringify(kvs)};
    })();`;
  }

  @Post('/api/admin/system_translation/list')
  @ApiOkResponse({
    type: SystemTranslationListResponseDto,
  })
  @ApiBody({ type: SystemTranslationQueryListDto })
  @AdminRoleGuard(createPerm('admin:system_translation:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: SystemTranslationQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/system_translation/info')
  @ApiOkResponse({
    type: SystemTranslationDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_translation:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: SystemTranslationByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/system_translation/create')
  @ApiOkResponse({
    type: SystemTranslationDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_translation:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: SystemTranslationCreateDto) {
    const newData = await this.services.create(data);
    this.renderViewService.loadI18n();
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/system_translation/create/multi')
  @ApiOkResponse({
    type: SystemTranslationDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_translation:multi_create', `批量创建${MODULE_NAME}`))
  async apiMultiCreate(@Body() data: SystemTranslationMultiCreateDto) {
    const newData = await this.services.mulitUpsert(data.list);
    this.renderViewService.loadI18n();
    return successResponse(newData, '批量创建成功');
  }

  @Post('/api/admin/system_translation/update')
  @ApiOkResponse({
    type: SystemTranslationDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:system_translation:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: SystemTranslationUpdateDto) {
    await this.services.update(data);
    this.renderViewService.loadI18n();
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/system_translation/export')
  @AdminRoleGuard(createPerm('admin:content_translation:export', `导出${MODULE_NAME}`))
  @ApiOkResponse({ type: ResponseResult<null> })
  @ApiBody({ type: ExportParamsDto })
  async export(@Body() body: ExportParamsDto) {
    const dataList = await this.services.findAll();
    return exportData({
      dataList,
      exportType: body.export_type,
      repository: this.services.repository,
      name: MODULE_NAME,
    });
  }

  @Post('/api/admin/system_translation/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:system_translation:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: SystemTranslationByIdParamDto) {
    await this.services.remove(id);
    this.renderViewService.loadI18n();
    return successResponse(null, '删除成功');
  }
}
