import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { successResponse } from '@/utils';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { RenderViewService } from './render_view.service';

const MODULE_NAME = '模板渲染';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class RenderViewController {
  constructor(private service: RenderViewService) {}

  // @Get('*')
  // public async render(@Req() req: Request, @Res() res: Response) {
  //   await this.service.handler(req, res);
  // }

  @Post('/api/admin/init_render_view_global_data')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:render_view:init_global_data', `初始化模版引擎全局数据`))
  async initRenderViewGlobalData() {
    await this.service.loadGlobal();
    return successResponse(null, '');
  }
}
