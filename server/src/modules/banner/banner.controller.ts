import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { UserByAdmin } from '@/modules/user_admin/user_admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { UserAdminInfo } from '../user_admin/user_admin.dto';
import {
  BannerByIdParamDto,
  BannerCreateDto,
  BannerDetailIdResponseDto,
  BannerDetailResponseDto,
  BannerListResponseDto,
  BannerQueryListDto,
  BannerUpdateDto,
} from './banner.dto';
import { BannerService } from './banner.service';

const MODULE_NAME = '广告';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class BannerController {
  constructor(private services: BannerService) {}

  @Post('/api/admin/banner/list')
  @ApiOkResponse({
    type: BannerListResponseDto,
  })
  @ApiBody({ type: BannerQueryListDto })
  @AdminRoleGuard(createPerm('admin:banner:list', `获取${MODULE_NAME}列表`))
  async apiList(@Body() body: BannerQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  @Post('/api/admin/banner/info')
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:info', `获取${MODULE_NAME}详情`))
  async apiDetail(@Body() { id }: BannerByIdParamDto) {
    const data = await this.services.findById(id);
    return successResponse(data);
  }

  @Post('/api/admin/banner/create')
  @ApiOkResponse({
    type: BannerDetailResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:create', `新增${MODULE_NAME}`))
  async apiCreate(@Body() data: BannerCreateDto, @UserByAdmin() user: UserAdminInfo) {
    const newData = await this.services.create(data, user);
    return successResponse(newData, '创建成功');
  }

  @Post('/api/admin/banner/update')
  @ApiOkResponse({
    type: BannerDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:banner:update', `修改${MODULE_NAME}`))
  async apiUpdate(@Body() data: BannerUpdateDto) {
    await this.services.update(data);
    return successResponse(data.id, '修改成功');
  }

  @Post('/api/admin/banner/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:banner:delete', `删除${MODULE_NAME}`))
  async apiDelete(@Body() { id }: BannerByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
