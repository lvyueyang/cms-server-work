import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { createPermGroup } from '@/common/common.permission';
import { ResponseResult } from '@/interface';
import { UserByAdmin } from '@/modules/user_admin/user_admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import { createLoginPageUrl } from '@/views';
import { Token } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { TrackService } from '../track/track.service';
import { UserAdminInfo } from '../user_admin/user_admin.dto';
import {
  FileManageAddOrRemoveTagsDto,
  FileManageByIdParamDto,
  FileManageDetailIdResponseDto,
  FileManageListResponseDto,
  FileManageQueryListDto,
  FileManageRenameDto,
  FileManageUpdateDto,
  FileUploadDto,
} from './file_manage.dto';
import { FileManage } from './file_manage.entity';
import { FileManageService } from './file_manage.service';

const MODULE_NAME = '文件管理';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class FileManageController {
  constructor(
    private services: FileManageService,
    private authService: AuthService,
    private trackService: TrackService
  ) {}

  @Post('/api/admin/file_manage/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    type: FileUploadDto,
  })
  @ApiOkResponse({
    type: ResponseResult<string>,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:upload', `文件上传`))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UserByAdmin() user: UserAdminInfo, @UploadedFile() file: Express.Multer.File) {
    const res = await this.services.uploadLocal(file, 'files', user, []);
    return successResponse(res, '上传成功');
  }

  @Post('/api/admin/file_manage/list')
  @ApiOkResponse({
    type: FileManageListResponseDto,
  })
  @ApiBody({ type: FileManageQueryListDto })
  @AdminRoleGuard(createPerm('admin:file_manage:list', `获取文件列表`))
  async apiList(@Body() body: FileManageQueryListDto) {
    const [list, total] = await this.services.findList(body);
    return successResponse({ list, total });
  }

  // 根据文件ID/名称返回文件流
  @Get(['/getfile/:id', '/getfilebyname/:name'])
  @ApiOperation({
    summary: '根据文件ID/名称返回文件流',
    description: '根据文件ID/名称返回文件流',
  })
  @ApiOkResponse({
    type: StreamableFile,
  })
  async getFileById(
    @Token() token: string,
    @Res() res: Response,
    @Param('id') id: string,
    @Param('name') name: string,
    @Ip() ip: string
  ) {
    let info: FileManage | null = null;
    if (name) {
      info = await this.services.findByName(name);
    } else {
      info = await this.services.findById(id);
    }
    if (!info) {
      throw new BadRequestException('文件不存在', 'file not found');
    }
    if (info.login_download_auth) {
      const [user, errMsg] = await this.authService.userClientIsLogin({
        token,
      });
      if (errMsg) {
        // 重定向到登录页
        res.redirect(createLoginPageUrl({ message: '文件需要登录才能下载' }));
        return;
      }
      this.trackService.create({
        event: 'file_download',
        properties: {
          file_id: info.id,
          file_name: info.name,
          ip,
        },
        userId: user?.id,
      });
    }
    const absolutePath = await this.services.getFileAbsolutePath(info);
    const stream = createReadStream(absolutePath);
    const type = info.type || 'application/octet-stream';
    const disposition = `inline; filename=${encodeURI(info.name)}`;
    res.setHeader('Content-Type', type);
    res.setHeader('Content-Disposition', disposition);
    res.setHeader('Content-Length', info.size);
    stream.pipe(res);
    // return new StreamableFile(stream, {
    //   type,
    //   disposition,
    //   length: info.size,
    // });
  }

  // 更新文件信息
  @Post('/api/admin/file_manage/update')
  @ApiOkResponse({
    type: FileManageDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:update', `更新文件信息`))
  async apiUpdate(@Body() data: FileManageUpdateDto) {
    await this.services.update({
      id: data.id,
      desc: data.desc,
      login_download_auth: data.login_download_auth,
    });
    return successResponse(data.id, '更新成功');
  }

  // 文件重命名
  @Post('/api/admin/file_manage/rename')
  @ApiOkResponse({
    type: FileManageDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:rename', `文件重命名`))
  async apiRename(@Body() data: FileManageRenameDto) {
    await this.services.rename({
      id: data.id,
      name: data.name,
    });
    return successResponse(data.id, '重命名成功');
  }

  @Post('/api/admin/file_manage/add_tags')
  @ApiOkResponse({
    type: FileManageDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:add_tags', `添加文件标签`))
  async apiAddTags(@Body() data: FileManageAddOrRemoveTagsDto) {
    await this.services.addTags(data.id, data.tags);
    return successResponse(data.id, '添加成功');
  }

  @Post('/api/admin/file_manage/delete_tags')
  @ApiOkResponse({
    type: FileManageDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:delete_tags', `删除文件标签`))
  async apiDeleteTags(@Body() data: FileManageAddOrRemoveTagsDto) {
    await this.services.removeTags(data.id, data.tags);
    return successResponse(data.id, '删除成功');
  }

  @Post('/api/admin/file_manage/delete')
  @ApiOkResponse({
    type: ResponseResult<null>,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:delete', `删除文件`))
  async apiDelete(@Body() { id }: FileManageByIdParamDto) {
    await this.services.remove(id);
    return successResponse(null, '删除成功');
  }
}
