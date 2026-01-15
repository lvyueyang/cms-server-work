import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Between, DataSource, Repository } from 'typeorm';
import { CRUDQuery, Pagination } from '@/interface';
import { createOrder } from '@/utils';
import { paginationTransform } from '@/utils/whereTransform';
import { META_PROPERTIES_TYPE } from '../../constants';
import { LoggerService } from '../logger/logger.service';
import { TrackMetaEventService } from '../track_meta_event/track_meta_event.service';
import { TrackMetaPropertiesService } from '../track_meta_properties/track_meta_properties.service';
import { ChartItem } from './track.dto';
import { TrackEvent, TrackEventProperties } from './track.entity';

dayjs.extend(utc);

class TrackCreateInfo {
  event: string;
  properties: Record<string, string | boolean | number | string[] | dayjs.Dayjs>;
  userId?: string;
}

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEvent)
    private trackEventRepository: Repository<TrackEvent>,
    private metaEventServices: TrackMetaEventService,
    private metaPropertiesService: TrackMetaPropertiesService,
    private dataSource: DataSource,
    private logger: LoggerService
  ) {}

  onModuleInit() {
    this.importPreset();
  }

  async findList({
    name = '',
    start_date,
    end_date,
    ...params
  }: Pagination &
    CRUDQuery<TrackEvent> & {
      name?: string;
      start_date?: Date;
      end_date?: Date;
    } & {
      properties_key: string;
      properties_value: string;
    }) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const q: any = {};
    if (name) {
      q.name = name;
    }
    if (start_date && end_date) {
      q.create_date = Between<Date>(start_date, end_date);
    }
    const query = this.trackEventRepository.createQueryBuilder('trackEvent');
    query.where(q);
    query.leftJoinAndSelect('trackEvent.metaEvent', 'metaEvent');
    query.leftJoinAndSelect('trackEvent.user', 'user');
    query.leftJoinAndSelect('trackEvent.properties', 'properties');
    if (params.properties_key) {
      // query.andWhere((qb) => {
      //   const subQuery = qb
      //     .subQuery()
      //     .select('properties.key', 'properties.value')
      //     .from(TrackEventProperties, 'properties')
      //     .where('properties.key = :key', { key: params.properties_key })
      //     .andWhere('properties.value LIKE :value', {
      //       value: `%${params.properties_value}%`,
      //     })
      //     .getQuery();
      //   return 'trackEvent.id IN ' + subQuery;
      // });
      query.andWhere('properties.key = :key', { key: params.properties_key });
    }
    if (params.properties_value) {
      query.andWhere('properties.value LIKE :value', {
        value: `%${params.properties_value}%`,
      });
    }
    query.skip(skip);
    query.take(take);
    if (order) {
      query.orderBy(order);
    }
    return await query.getManyAndCount();
  }

  async create({ event, properties, userId }: TrackCreateInfo) {
    // 判断事件是否已创建
    const eventInfo = await this.metaEventServices.findByName(event);
    if (!eventInfo) {
      return;
    }

    // 过滤属性
    const ps: Pick<TrackEventProperties, 'key' | 'value' | 'type'>[] = [];
    for (const schema of eventInfo.properties || []) {
      const k = schema.name;
      const value = properties[k];
      let v: string = '';
      if (schema.type === META_PROPERTIES_TYPE.STRING || schema.type === META_PROPERTIES_TYPE.NUMBER) {
        if (value) {
          v = value + '';
        }
      }

      if (schema.type === META_PROPERTIES_TYPE.BOOLEAN) {
        if (value === true || value === '1') {
          v = '1';
        }
        if (value === false || value === '0') {
          v = '0';
        }
      }
      if (schema.type === META_PROPERTIES_TYPE.DATETIME) {
        if (value) {
          if (typeof value === 'string' || dayjs.isDayjs(value) || value instanceof Date) {
            v = dayjs(value).utc().format();
          }
        }
      }
      if (schema.type === META_PROPERTIES_TYPE.LIST) {
        if (value) {
          if (typeof value === 'string') {
            v = value;
          }
          if (Array.isArray(value)) {
            v = value.join(',');
          }
        }
      }
      if (v) {
        ps.push({
          key: k,
          value: value + '',
          type: schema.type,
        });
      }
    }

    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const t = new TrackEvent();
      t.name = event;
      if (userId) {
        t.userId = userId;
      }
      t.metaEventId = eventInfo.id;
      const r = await runner.manager.save(t);

      const propertiesList: TrackEventProperties[] = [];
      for await (const p of ps) {
        const e = new TrackEventProperties();
        e.key = p.key;
        e.value = p.value;
        e.type = p.type;
        e.trackEvent = r;
        await runner.manager.save(e);
        propertiesList.push(e);
      }
      await runner.commitTransaction();
      return r;
    } catch (e) {
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
  }

  async queryTotal(
    name: string,
    s: dayjs.Dayjs,
    e: dayjs.Dayjs,
    p?: {
      properties_key?: string;
      properties_value?: string;
    }
  ) {
    // 根据事件名称 name 与 create_date 查询最近 7 天每天的数量
    const start = s.toDate();
    const end = e.toDate();
    const q = this.trackEventRepository.createQueryBuilder('event');
    q.select('DATE_FORMAT(event.create_date, "%Y-%m-%d") as date');
    q.addSelect('COUNT(*) as count');
    q.where('event.name = :name', { name });
    q.andWhere('event.create_date >= :start', { start });
    q.andWhere('event.create_date <= :end', { end });
    // q.innerJoinAndSelect('event.properties', 'properties');
    // if (p.properties_key && p.properties_value) {
    //   q.leftJoinAndSelect('event.properties', 'properties');
    //   // q.andWhere('properties.key = :key', { key: p.properties_key });
    //   // q.andWhere('properties.value LIKE :value', {
    //   //   value: `%${p.properties_value || ''}%`,
    //   // });
    // }

    q.groupBy('DATE_FORMAT(event.create_date, "%Y-%m-%d")');
    q.addOrderBy('DATE_FORMAT(event.create_date, "%Y-%m-%d")');

    // 将 start 和 end 转为每天的数组
    const result: ChartItem[] = [];
    const len = Math.abs(dayjs(end).diff(dayjs(start), 'day'));
    const list = await q.getRawMany();
    for (let i = 0; i < len; i++) {
      const date = dayjs(start).add(i, 'day').format('YYYY-MM-DD');
      const count = Number(list.find((l) => l.date === date)?.count);
      result.push({
        date,
        count: isNaN(count) ? 0 : count,
      });
    }
    return result;
  }

  async track(opt: TrackCreateInfo) {
    try {
      await this.create(opt);
    } catch (e: any) {
      this.logger.error('埋点触发失败', e, JSON.stringify(opt || ''));
      console.error(e);
    }
  }

  // 导入预置的埋点事件
  async importPreset() {
    await this.metaPropertiesService.importPreset();
    await this.metaEventServices.importPreset();
  }
}
