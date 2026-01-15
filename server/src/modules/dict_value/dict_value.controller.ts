import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { AdminRoleGuard } from '../../modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '../../utils';
import {
  DictValueByIdParamDto,
  DictValueCreateDto,
  DictValueDeleteDto,
  DictValueDetailIdResponseDto,
  DictValueDetailResponseDto,
  DictValueListByTypeResponseDto,
  DictValueListResponseDto,
  DictValueQueryListByTypeDto,
  DictValueQueryListDto,
  DictValueUpdateDto,
} from './dict_value.dto';
import { DictValueService } from './dict_value.service';

const MODULE_NAME = '字典值';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class DictValueController {
  constructor(private services: DictValueService) {}

  @Post('/api/admin/dict_value/list_by_type')
  @ApiOkResponse({
    type: DictValueListByTypeResponseDto,
  })
  @ApiBody({ type: DictValueQueryListByTypeDto })
  @AdminRoleGuard(createPerm('admin:dict_value:list', `根据字典类型获取${MODULE_NAME}列表`))
  async apiListByType(@Body() body: DictValueQueryListByTypeDto) {
    const res = await this.services.findByType(body.type);
    return successResponse(res);
  }

  @Post('/api/admin/dict_value/list')
  @ApiOkResponse({
    type: DictValueListResponseDto,
  })
  @ApiBody({ type: DictValueQueryListDto })
  @AdminRoleGuard(createPerm('admin:dict_value:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: DictValueQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/dict_value/info')
  @ApiOkResponse({
    type: DictValueDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_value:info', `获取${MODULE_NAME}信息`))
  async apiDetail(@Body() { id }: DictValueByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/dict_value/create')
  @ApiOkResponse({
    type: DictValueDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_value:create', `创建${MODULE_NAME}`))
  async apiCreate(@Body() data: DictValueCreateDto) {
    const newData = await this.services.create(data);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/dict_value/update')
  @ApiOkResponse({
    type: DictValueDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_value:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: DictValueUpdateDto) {
    await this.services.update(data.id, data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/dict_value/delete')
  @ApiOperation({ summary: '删除字典值' })
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @ApiBody({ type: DictValueDeleteDto })
  @AdminRoleGuard(createPerm('admin:dict_value:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: DictValueDeleteDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
