import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DictValueCreateDto } from './dict_value.dto';
import { DictValue } from './dict_value.entity';
import { DictTypeService } from '../dict_type/dict_type.service';
import { ContentLang } from '@/constants';
import { isDefaultI18nLang } from '@/utils';
import { ContentTranslationService } from '../content_translation/content_translation.service';

type FormValues = DictValueCreateDto;

@Injectable()
export class DictValueService {
  constructor(
    @InjectRepository(DictValue)
    private repository: Repository<DictValue>,
    private readonly dictTypeService: DictTypeService,
    private readonly contentI18n: ContentTranslationService,
  ) {}

  findAll(lang?: ContentLang | string) {
    return this.repository.find().then((list) => {
      if (!isDefaultI18nLang(lang)) {
        return this.contentI18n.overlayTranslations(list, {
          entity: 'dict_value',
          fields: ['label', 'desc'],
          lang,
        });
      }
      return list;
    });
  }

  findList({
    keyword = '',
    typeId,
    is_available,
  }: {
    typeId: number;
    keyword?: string;
    is_available?: boolean;
  }) {
    const find = this.repository.createQueryBuilder('dict_value').where({
      label: Like(`%${keyword.trim()}%`),
      typeId: typeId,
    });
    if (is_available !== undefined) {
      find.andWhere({
        is_available,
      });
    }

    return find.getManyAndCount();
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('字典值不存在', 'dict_value not found');
    }
    return isExisted;
  }

  async findByType(type: string) {
    const dictType = await this.dictTypeService.findByType(type);
    const list = await this.repository.find({
      where: {
        type: dictType,
        is_available: true,
      },
    });
    if (!list.length) {
      throw new BadRequestException('字典值不存在', 'dict_value not found');
    }
    return {
      type,
      list,
    };
  }

  async create(data: FormValues) {
    const type = await this.dictTypeService.findById(data.typeId);
    const isExisted = await this.repository.find({
      where: [
        {
          label: data.label,
          typeId: data.typeId,
        },
        {
          value: data.value,
          typeId: data.typeId,
        },
      ],
    });
    if (isExisted.length) {
      throw new BadRequestException('字典值/名称已存在');
    }
    return this.repository.save({
      label: data.label,
      value: data.value,
      is_available: data.is_available,
      desc: data.desc,
      attr: data.attr,
      type,
      recommend: data.recommend,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('字典值不存在', 'dict_value not found');
    }
    return this.repository.delete(id);
  }

  async update(id: number, data: Partial<FormValues>) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('字典值不存在', 'dict_value not found');
    }
    return this.repository.update(id, {
      label: data.label,
      value: data.value,
      is_available: data.is_available,
      desc: data.desc,
      attr: data.attr,
      recommend: data.recommend,
    });
  }
}
