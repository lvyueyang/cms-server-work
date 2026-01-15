import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { AdminRoleGuard } from '../../modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '../../utils';
import { UserByAdmin } from '../user_admin/user_admin.decorator';
import { UserAdmin } from '../user_admin/user_admin.entity';
import {
  TrackMetaPropertiesByIdParamDto,
  TrackMetaPropertiesCreateDto,
  TrackMetaPropertiesDetailIdResponseDto,
  TrackMetaPropertiesDetailResponseDto,
  TrackMetaPropertiesListResponseDto,
  TrackMetaPropertiesQueryListDto,
  TrackMetaPropertiesUpdateDto,
} from './track_meta_properties.dto';
import { TrackMetaPropertiesService } from './track_meta_properties.service';

const MODULE_NAME = '事件元属性';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class TrackMetaPropertiesController {
  constructor(private services: TrackMetaPropertiesService) {}

  @Post('/api/admin/track_meta_properties/list')
  @ApiOkResponse({
    type: TrackMetaPropertiesListResponseDto,
  })
  @ApiBody({ type: TrackMetaPropertiesQueryListDto })
  @AdminRoleGuard(createPerm('admin:track_meta_properties:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() query: TrackMetaPropertiesQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Post('/api/admin/track_meta_properties/info')
  @ApiOkResponse({
    type: TrackMetaPropertiesDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_properties:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: TrackMetaPropertiesByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/track_meta_properties/create')
  @ApiOkResponse({
    type: TrackMetaPropertiesDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_properties:create', `创建${MODULE_NAME}`))
  async apiCreate(@Body() data: TrackMetaPropertiesCreateDto, @UserByAdmin() user: UserAdmin) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/track_meta_properties/update')
  @ApiOkResponse({
    type: TrackMetaPropertiesDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_properties:update', `更新${MODULE_NAME}`))
  async apiUpdate(@Body() { id, ...data }: TrackMetaPropertiesUpdateDto) {
    await this.services.update(id, data);
    return successResponse(id, '修改成功');
  }

  @Post('/api/admin/track_meta_properties/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_properties:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: TrackMetaPropertiesByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
