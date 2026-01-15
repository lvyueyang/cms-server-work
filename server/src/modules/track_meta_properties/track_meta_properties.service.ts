import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { TRACK_META_PROPERTY } from '@/common/track';
import { CRUDQuery, Pagination } from '@/interface';
import { UserAdmin } from '../../modules/user_admin/user_admin.entity';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { TrackMetaPropertiesCreateDto } from './track_meta_properties.dto';
import { TrackMetaProperties } from './track_meta_properties.entity';

type FormValues = TrackMetaPropertiesCreateDto;

@Injectable()
export class TrackMetaPropertiesService {
  constructor(
    @InjectRepository(TrackMetaProperties)
    private repository: Repository<TrackMetaProperties>
  ) {}

  findAll() {
    return this.repository.find({ where: { is_delete: false } });
  }

  findList({
    name = '',
    cname = '',
    ...params
  }: Pagination & CRUDQuery<TrackMetaProperties> & { name?: string; cname?: string }) {
    return this.repository.findAndCount({
      ...paginationTransform(params),
      ...createOrder(params),
      where: {
        is_delete: false,
        name: Like(`%${name.trim()}%`),
        cname: Like(`%${cname.trim()}%`),
      },
    });
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('元属性不存在', 'track_meta_properties not found');
    }
    return isExisted;
  }

  async findByNames(names: string[]) {
    const isExisted = await this.repository.find({
      where: {
        name: In(names),
        is_delete: false,
      },
    });
    return isExisted || [];
  }

  async create(data: FormValues, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      name: data.name,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('属性名称重复');
    }
    return this.repository.save({
      name: data.name,
      cname: data.cname,
      type: data.type,
      desc: data.desc,
      authorId: author.id,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('元属性不存在', 'track_meta_properties not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<Pick<FormValues, 'cname' | 'desc'>>) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('元属性不存在', 'track_meta_properties not found');
    }
    return this.repository.update(id, {
      cname: data.cname,
      desc: data.desc,
    });
  }

  // 导入预置的埋点属性
  async importPreset() {
    for (const preset of TRACK_META_PROPERTY) {
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
          await this.repository.save({
            ...preset,
          });
        } catch (e) {
          console.warn(`Failed to create track meta property ${preset.name}:`, e);
        }
      }
    }
    return true;
  }
}
