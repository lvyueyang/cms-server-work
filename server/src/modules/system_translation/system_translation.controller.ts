import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
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
import { createPermGroup } from '@/common/common.permission';
import Lang from '@/common/lang.decorator';
import { ContentLang } from '@/constants';
import { RenderViewService } from '../render_view/render_view.service';

const MODULE_NAME = '国际化';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class SystemTranslationController {
  constructor(
    private services: SystemTranslationService,
    private renderViewService: RenderViewService,
  ) {}

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
  async apiCreate(@Body() data: SystemTranslationCreateDto, @User() user) {
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
