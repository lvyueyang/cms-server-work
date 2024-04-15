import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { getLogDirPath, successResponse } from 'src/utils';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import { LoggerByDateParamDto, LoggerDetailResponseDto, LoggerListResponseDto } from './logger.dto';
import { PERMISSION } from './logger.permission';

@ApiTags('系统日志')
@Controller()
export class LoggerController {
  logDir = getLogDirPath();

  @Get('/api/admin/logger')
  @ApiOperation({ summary: '日志列表' })
  @AdminRoleGuard(PERMISSION.LIST)
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
  @ApiOperation({ summary: '日志详情' })
  @AdminRoleGuard(PERMISSION.INFO)
  @ApiOkResponse({
    type: LoggerDetailResponseDto,
  })
  async apiDetail(@Param() { date }: LoggerByDateParamDto) {
    const p = join(this.logDir, date, 'error.log');
    const content = readFileSync(p).toString('utf-8');
    return successResponse(content ? content.split('\n') : []);
  }
}
