import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { AdminRoleGuard } from '../../modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '../../utils';
import { UserByAdmin } from '../user_admin/user_admin.decorator';
import { UserAdminInfo } from '../user_admin/user_admin.dto';
import {
  TrackMetaEventByIdParamDto,
  TrackMetaEventCreateDto,
  TrackMetaEventDetailIdResponseDto,
  TrackMetaEventDetailResponseDto,
  TrackMetaEventListResponseDto,
  TrackMetaEventQueryListDto,
  TrackMetaEventUpdateDto,
} from './track_meta_event.dto';
import { TrackMetaEventService } from './track_meta_event.service';

const MODULE_NAME = '事件元属性';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class TrackMetaEventController {
  constructor(private services: TrackMetaEventService) {}

  @Post('/api/admin/track_meta_event/list')
  @ApiOkResponse({
    type: TrackMetaEventListResponseDto,
  })
  @ApiBody({ type: TrackMetaEventQueryListDto })
  @AdminRoleGuard(createPerm('admin:track_meta_event:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() query: TrackMetaEventQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Post('/api/admin/track_meta_event/info')
  @ApiOkResponse({
    type: TrackMetaEventDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_event:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: TrackMetaEventByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/track_meta_event/create')
  @ApiOkResponse({
    type: TrackMetaEventDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_event:create', `创建${MODULE_NAME}`))
  async apiCreate(@Body() data: TrackMetaEventCreateDto, @UserByAdmin() user: UserAdminInfo) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/track_meta_event/update')
  @ApiOkResponse({
    type: TrackMetaEventDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_event:update', `更新${MODULE_NAME}`))
  async apiUpdate(@Body() data: TrackMetaEventUpdateDto) {
    await this.services.update(data.id, data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/track_meta_event/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:track_meta_event:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: TrackMetaEventByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
