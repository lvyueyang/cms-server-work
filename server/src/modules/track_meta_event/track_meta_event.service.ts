import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TRACK_META_EVENTS } from '@/common/track';
import { CRUDQuery, Pagination } from '@/interface';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { TrackMetaPropertiesService } from '../track_meta_properties/track_meta_properties.service';
import { UserAdminInfo } from '../user_admin/user_admin.dto';
import { TrackMetaEventCreateDto } from './track_meta_event.dto';
import { TrackMetaEvent } from './track_meta_event.entity';

type FormValues = TrackMetaEventCreateDto;

@Injectable()
export class TrackMetaEventService {
  constructor(
    @InjectRepository(TrackMetaEvent)
    private repository: Repository<TrackMetaEvent>,

    private metaPropertiesServices: TrackMetaPropertiesService
  ) {}

  findAll() {
    return this.repository.find({ where: { is_delete: false } });
  }

  findList({
    name = '',
    cname = '',
    ...params
  }: Pagination & CRUDQuery<TrackMetaEvent> & { name?: string; cname?: string }) {
    return this.repository.findAndCount({
      ...paginationTransform(params),
      ...createOrder(params),
      where: {
        is_delete: false,
        name: Like(`%${name.trim()}%`),
        cname: Like(`%${cname.trim()}%`),
      },
      relations: ['properties'],
    });
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('元事件不存在', 'track_meta_event not found');
    }
    return isExisted;
  }

  async findByName(name: string) {
    const isExisted = await this.repository.find({
      where: {
        name,
        is_delete: false,
      },
      relations: ['properties'],
    });
    return isExisted[0];
  }

  async create(data: FormValues, author: UserAdminInfo) {
    const isExisted = await this.repository.findOneBy({
      name: data.name,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('元事件已存在');
    }
    const properties = await this.metaPropertiesServices.findByNames(data.properties);
    return this.repository.save({
      name: data.name,
      cname: data.cname,
      desc: data.desc,
      properties,
      authorId: author.id,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('元事件不存在', 'track_meta_event not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<FormValues>) {
    const metaEvent = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!metaEvent) {
      throw new BadRequestException('元事件不存在', 'track_meta_event not found');
    }
    const properties = await this.metaPropertiesServices.findByNames(data.properties || []);
    metaEvent.properties = properties;
    return await this.repository.save(metaEvent);
  }

  // 导入预置的埋点属性
  async importPreset() {
    for (const preset of TRACK_META_EVENTS) {
      const exists = await this.repository.findOne({
        where: {
          name: preset.name,
        },
      });
      if (exists) {
        if (exists.is_delete) {
          await this.repository.update(exists.id, { is_delete: false });
        }
      } else {
        try {
          const properties = await this.metaPropertiesServices.findByNames(preset.properties || []);
          await this.repository.save({
            name: preset.name,
            cname: preset.cname,
            desc: preset.desc,
            properties,
          });
        } catch (e) {
          console.warn(`Failed to create track meta property ${preset.name}:`, e);
        }
      }
    }
    return true;
  }
}
