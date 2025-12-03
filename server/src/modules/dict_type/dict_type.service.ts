import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDQuery } from '@/interface';
import { createOrder, isDefaultI18nLang } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { Like, Repository } from 'typeorm';
import { DictTypeCreateDto } from './dict_type.dto';
import { DictType } from './dict_type.entity';
import { ContentTranslationService } from '../content_translation/content_translation.service';
import { ContentLang } from '@/constants';

type FormValues = DictTypeCreateDto;

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictType)
    private repository: Repository<DictType>,
    private contentI18n: ContentTranslationService,
  ) {}

  findAll(lang?: ContentLang) {
    return this.repository
      .find({
        where: { is_delete: false, is_available: true },
        relations: ['values'],
      })
      .then(async (list) => {
        if (!isDefaultI18nLang(lang)) {
          for await (const item of list) {
            item.values = await this.contentI18n.overlayTranslations(item.values, {
              entity: 'dict_value',
              fields: ['label', 'desc'],
              lang,
            });
          }
          return this.contentI18n.overlayTranslations(list, {
            entity: 'dict_type',
            fields: ['name', 'desc'],
            lang,
          });
        }
        return list;
      });
  }

  findList({ keyword = '', ...params }: CRUDQuery<DictType>) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};

    const find = this.repository
      .createQueryBuilder('dict_type')
      .where({
        is_delete: false,
        name: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    if (params?.is_available !== undefined) {
      find.andWhere({
        is_available: params.is_available,
      });
    }
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('dict_type.' + key, value);
    });

    return find.getManyAndCount();
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('字典不存在', 'dict_type not found');
    }
    return isExisted;
  }
  async findByType(type: string) {
    const isExisted = await this.repository.find({
      where: {
        type,
        is_delete: false,
      },
      relations: ['values'],
    });
    if (!isExisted) {
      throw new BadRequestException('字典不存在', 'dict_type not found');
    }
    return isExisted[0];
  }
  async findByTypeOrigin(type: string) {
    const infos = await this.repository.find({
      where: {
        type,
      },
      relations: ['values'],
    });
    return infos[0];
  }

  async create(data: FormValues) {
    const isExisted = await this.repository.find({
      where: [
        {
          name: data.name,
        },
        {
          type: data.type,
        },
      ],
    });
    if (isExisted.length) {
      throw new BadRequestException('字典类型/名称已存在');
    }
    return this.repository.save({
      is_available: data.is_available,
      name: data.name,
      type: data.type,
      desc: data.desc,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('字典不存在', 'dict_type not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(id: number, data: Partial<FormValues>) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('字典不存在', 'dict_type not found');
    }
    return this.repository.update(id, {
      is_available: data.is_available,
      name: data.name,
      type: data.type,
      desc: data.desc,
    });
  }
  // 恢复删除
  async recover(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: true,
    });
    if (!isExisted) {
      throw new BadRequestException('字典不存在', 'dict_type not found');
    }
    return this.repository.update(id, { is_delete: false });
  }
}
