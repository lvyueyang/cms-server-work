import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { createPermGroup } from '@/common/common.permission';
import { successResponse } from '@/utils';
import { AdminRoleGuard } from '../user_admin_role/user_admin_role.guard';
import {
  GetTrackEventChartQueryDto,
  GetTrackEventChartResponseDto,
  GetTrackEventListQueryDto,
  GetTrackEventListResponseDto,
} from './track.dto';
import { TrackService } from './track.service';

const MODULE_NAME = '事件分析';
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class TrackController {
  constructor(private services: TrackService) {}

  @Post('/api/admin/track-event/list')
  @ApiOkResponse({
    type: GetTrackEventListResponseDto,
  })
  @ApiBody({ type: GetTrackEventListQueryDto })
  @AdminRoleGuard(createPerm('admin:track_event:list', `事件列表`))
  async apiList(@Body() query: GetTrackEventListQueryDto) {
    const q: any = {
      name: query.name,
      current: query.current,
      page_size: query.page_size,
      properties_key: query.properties_key,
      properties_value: query.properties_value,
    };
    if (query.start_date) {
      q.start_date = dayjs(query.start_date).utc().toDate();
      q.end_date = dayjs(query.end_date).utc().toDate();
    }
    const [list, total] = await this.services.findList(q);
    return successResponse({ list, total });
  }

  @Post('/api/admin/track/query-chart')
  @ApiOkResponse({
    type: GetTrackEventChartResponseDto,
  })
  @ApiBody({ type: GetTrackEventChartQueryDto })
  @AdminRoleGuard(createPerm('admin:track_event:query_chart', `事件分析图表查询`))
  async queryChart(@Body() query: GetTrackEventChartQueryDto) {
    const res = await this.services.queryTotal(
      query.name,
      dayjs(query.start_date),
      dayjs(query.end_date),
      {
        properties_key: query.properties_key,
        properties_value: query.properties_value,
      }
      // 'use_remote_tryout',
      // dayjs().subtract(60, 'day'),
      // dayjs(),
    );
    return successResponse(res);
  }

  @Get('/api/admin/track')
  @ApiExcludeEndpoint()
  async apiCreate() {
    return false;
    // const newData = await this.services.create({
    //   event: 'testeve2',
    //   properties: {
    //     test1: '111',
    //     test2: '222',
    //     test3: true,
    //   },
    //   userId: '1',
    // });
    // return newData;
  }
}
