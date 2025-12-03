import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/interface';
import { User } from '@/modules/user_admin/user-admin.decorator';
import { AdminRoleGuard } from '@/modules/user_admin_role/user_admin_role.guard';
import { successResponse } from '@/utils';
import {
  FileManageAddOrRemoveTagsDto,
  FileManageByIdParamDto,
  FileManageDetailIdResponseDto,
  FileManageDetailResponseDto,
  FileManageListResponseDto,
  FileManageQueryListDto,
  FileManageUpdateDto,
  FileUploadDto,
} from './file_manage.dto';
import { FileManageService } from './file_manage.service';
import { createPermGroup } from '@/common/common.permission';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import filetype from 'file-type';

const MODULE_NAME = '文件管理';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class FileManageController {
  constructor(private services: FileManageService) {}

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
  async uploadFile(@User() user, @UploadedFile() file: Express.Multer.File) {
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

  // 根据文件ID返回文件流
  @Get('/getfile/:id')
  @ApiOkResponse({
    type: FileManageDetailResponseDto,
  })
  async getFileById(@Param('id') id: string) {
    const info = await this.services.findById(id);
    const absolutePath = await this.services.getFileAbsolutePath(info);
    const stream = createReadStream(absolutePath);
    const type = info.type || 'application/octet-stream';
    // res.set({
    //   'content-type': 'application/octet-stream',
    //   'content-disposition':
    //     'attachment;filename=' + encodeURI(filename + '.xlsx'),
    // });
    return new StreamableFile(stream, {
      type,
      disposition: `attachment; filename=${encodeURI(info.name)}`,
      length: info.size,
    });
  }

  // 根据文件名称返回文件流
  @Get('/getfilebyname/:name')
  @ApiOkResponse({
    type: FileManageDetailResponseDto,
  })
  async getFileByName(@Param('name') name: string) {
    const info = await this.services.findByName(name);
    const absolutePath = await this.services.getFileAbsolutePath(info);
    const stream = createReadStream(absolutePath);
    const type = info.type || 'application/octet-stream';
    // res.set({
    //   'content-type': 'application/octet-stream',
    //   'content-disposition':
    //     'attachment;filename=' + encodeURI(filename + '.xlsx'),
    // });
    return new StreamableFile(stream, {
      type,
      disposition: `attachment; filename=${encodeURI(info.name)}`,
      length: info.size,
    });
  }

  // 更新文件信息
  @Post('/api/admin/file_manage/update')
  @ApiOkResponse({
    type: FileManageDetailIdResponseDto,
  })
  @AdminRoleGuard(createPerm('admin:file_manage:update', `更新文件信息`))
  async apiUpdate(@Body() data: FileManageUpdateDto) {
    await this.services.update({ id: data.id, desc: data.desc });
    return successResponse(data.id, '更新成功');
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
