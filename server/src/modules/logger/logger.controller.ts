import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { createPermGroup } from '@/common/common.permission';
import { getLogDirPath, successResponse } from '@/utils';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { LoggerByDateParamDto, LoggerDetailResponseDto, LoggerListResponseDto } from './logger.dto';

const MODULE_NAME = '系统日志';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class LoggerController {
  logDir = getLogDirPath();

  @Get('/api/admin/logger')
  @AdminRoleGuard(createPerm('admin:logger:list', '获取日志列表'))
  @ApiOkResponse({
    type: LoggerListResponseDto,
  })
  async apiList() {
    const list = readdirSync(this.logDir);
    list.sort((a, b) => {
      if (dayjs(a).isAfter(dayjs(b))) {
        return -1;
      }
      return 1;
    });
    return successResponse(list);
  }

  @Get('/api/admin/logger/:date')
  @AdminRoleGuard(createPerm('admin:logger:info', '获取日志详情'))
  @ApiOkResponse({
    type: LoggerDetailResponseDto,
  })
  async apiDetail(@Param() { date }: LoggerByDateParamDto) {
    const p = join(this.logDir, date, 'error.log');
    const content = readFileSync(p).toString('utf-8');
    return successResponse(content ? content.split('\n') : []);
  }
}
