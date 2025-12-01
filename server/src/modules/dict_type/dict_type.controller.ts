import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { AdminRoleGuard } from '../../modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '../../utils';
import {
  DictTypeByIdParamDto,
  DictTypeCreateDto,
  DictTypeDetailIdResponseDto,
  DictTypeDetailResponseDto,
  DictTypeListAllResponseDto,
  DictTypeListResponseDto,
  DictTypeQueryListDto,
  DictTypeUpdateDto,
} from './dict_type.dto';
import { DictTypeService } from './dict_type.service';
import { createPermGroup } from '@/common/common.permission';
import { AdminLogin } from '../auth/auth.guard';

const MODULE_NAME = '字典类型';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class DictTypeController {
  constructor(private services: DictTypeService) {}

  @Post('/api/admin/dict/all')
  @ApiOperation({ summary: '全部字典列表' })
  @ApiOkResponse({
    type: DictTypeListAllResponseDto,
  })
  @AdminLogin()
  async apiListAll() {
    const list = await this.services.findAll();
    return successResponse(list);
  }

  @Post('/api/admin/dict_type/list')
  @ApiOkResponse({
    type: DictTypeListResponseDto,
  })
  @ApiBody({ type: DictTypeQueryListDto })
  @AdminRoleGuard(createPerm('admin:dict_type:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() query: DictTypeQueryListDto) {
    const [list, total] = await this.services.findList(query);
    return successResponse({ list, total });
  }

  @Post('/api/admin/dict_type/info')
  @ApiOkResponse({
    type: DictTypeDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_type:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: DictTypeByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/dict_type/create')
  @ApiOkResponse({
    type: DictTypeDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_type:create', `创建${MODULE_NAME}`))
  async apiCreate(@Body() data: DictTypeCreateDto) {
    const newData = await this.services.create(data);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/dict_type/update')
  @ApiOperation({ summary: '修改字典类型' })
  @ApiOkResponse({
    type: DictTypeDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:dict_type:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: DictTypeUpdateDto) {
    await this.services.update(data.id, data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/dict_type/delete')
  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:dict_type:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: DictTypeByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
