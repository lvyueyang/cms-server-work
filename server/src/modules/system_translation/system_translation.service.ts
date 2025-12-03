import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDQuery } from '@/interface';
import { createOrder } from '@/utils';
import { paginationTransform } from '@/utils/whereTransform';
import { Like, Repository } from 'typeorm';
import { SystemTranslation } from './system_translation.entity';
import { SystemTranslationCreateDto, SystemTranslationUpdateDto } from './system_translation.dto';
import { ContentLang } from '@/constants';

@Injectable()
export class SystemTranslationService {
  constructor(
    @InjectRepository(SystemTranslation)
    private repository: Repository<SystemTranslation>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  findList({
    key,
    lang,
    value,
    ...params
  }: CRUDQuery<SystemTranslation> & {
    lang?: ContentLang;
    key?: string;
    value?: string;
  }) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};

    const find = this.repository.createQueryBuilder('system_translation').skip(skip).take(take);
    if (key) {
      find.andWhere({
        key: Like(`%${key.trim()}%`),
      });
    }
    if (lang) {
      find.andWhere({
        lang,
      });
    }
    if (value) {
      find.andWhere({
        value: Like(`%${value.trim()}%`),
      });
    }
    if (params?.is_available !== undefined) {
      find.andWhere({
        is_available: params.is_available,
      });
    }
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('system_translation.' + key, value);
    });

    return find.getManyAndCount();
  }

  async findById(id: number) {
    const info = await this.repository.findOneBy({
      id,
    });
    if (!info) {
      throw new BadRequestException('国际化不存在', 'system_translation not found');
    }
    return info;
  }

  // 批量添加或者更新翻译
  async mulitUpsert(translations: SystemTranslationCreateDto[]) {
    if (!translations.length) return [];

    // 构建复合查询条件
    const conditions = translations.map((t) => ({
      key: t.key,
      lang: t.lang,
    }));

    // 批量查询已存在的记录
    const existingRecords = await this.repository.find({
      where: conditions,
    });

    // 创建现有记录的映射，方便快速查找
    const existingMap = new Map<string, SystemTranslation>();
    existingRecords.forEach((record) => {
      const key = `${record.key}-${record.lang}`;
      existingMap.set(key, record);
    });

    const toUpdate: SystemTranslation[] = [];
    const toCreate: SystemTranslation[] = [];
    const results: number[] = [];

    // 分类处理：更新 vs 创建
    translations.forEach((translation) => {
      const lang = translation.lang;
      const key = `${translation.key}-${lang}`;
      const existing = existingMap.get(key);

      if (existing) {
        // 更新现有记录
        existing.value = translation.value;
        existing.lang = lang;
        toUpdate.push(existing);
        results.push(existing.id);
      } else {
        // 创建新记录
        const newRecord = this.repository.create({
          key: translation.key,
          lang,
          value: translation.value,
        });
        toCreate.push(newRecord);
      }
    });

    // 批量更新
    if (toUpdate.length) {
      await this.repository.save(toUpdate);
    }

    // 批量创建
    if (toCreate.length) {
      const createdRecords = await this.repository.save(toCreate);
      createdRecords.forEach((record) => results.push(record.id));
    }

    return results;
  }

  async create(data: SystemTranslationCreateDto) {
    const info = await this.repository.findOneBy({
      key: data.key,
      lang: data.lang,
    });
    if (info) {
      throw new BadRequestException('国际化已存在');
    }
    return this.repository.save({
      key: data.key,
      lang: data.lang,
      value: data.value,
      desc: data.desc,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
    });
    if (!isExisted) {
      throw new BadRequestException('国际化不存在', 'system_translation not found');
    }
    return this.repository.delete(id);
  }

  async update(data: SystemTranslationUpdateDto) {
    const info = await this.repository.findOneBy({
      id: data.id,
    });
    if (!info) {
      throw new BadRequestException('国际化不存在', 'system_translation not found');
    }
    return this.repository.update(data.id, {
      value: data.value,
      desc: data.desc,
    });
  }
}
