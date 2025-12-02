import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDQuery } from '@/interface';
import { createOrder } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { {{entityName}} } from './{{name}}.entity';
import { {{entityName}}CreateDto, {{entityName}}UpdateDto } from './{{name}}.dto';
import { ContentLang } from '@/constants';
import { ContentTranslationService } from '../content_translation/content_translation.service';

@Injectable()
export class {{entityName}}Service {
  constructor(
    @InjectRepository({{entityName}})
    private repository: Repository<{{entityName}}>,
  ) {}

  findAll() {
    return this.repository.find({
      where: { is_delete: false },
    });
  }

  findList({ keyword = '', ...params }: CRUDQuery<{{entityName}}>, lang?: ContentLang) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('{{name}}')
      .where({
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('{{name}}.' + key, value);
    });
    
    return find.getManyAndCount().then(async ([list, total]) => {
      if (isDefaultI18nLang(lang)) return [list, total] as const;
      const patched = await this.contentTranslationService.overlayTranslations(list, {
        entity: '{{name}}',
        fields: ['title', 'desc', 'content'],
        lang,
      });
      return [patched, total] as const;
    });;
  }

  async findById(id: number, lang?: ContentLang) {
    const info = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('{{cname}}不存在', '{{name}} not found');
    }
    if (!isDefaultI18nLang(lang)) return info;
    const [patched] = await this.contentTranslationService.overlayTranslations([info], {
      entity: '{{name}}',
      fields: ['title', 'desc', 'content'],
      lang,
    });
    return patched;
  }

  async findNextAndPrev(id: number, lang?: ContentLang) {
    const currentInfo = await this.findById(id);
    const [nextInfo, prevInfo] = await Promise.all([
      this.repository.findOne({
        where: {
          id: LessThan(id),
          is_delete: false,
        },
        order: {
          id: 'DESC',
        },
      }),
      this.repository.findOne({
        where: {
          id: MoreThan(id),
          is_delete: false,
        },
        order: {
          id: 'ASC',
        },
      }),
    ]);
    
    let patchedNext = nextInfo || null;
    let patchedPrev = prevInfo || null;
    if (!isDefaultI18nLang(lang)) {
      const items = [nextInfo, prevInfo].filter(Boolean);
      if (items.length) {
        const patched = await this.contentTranslationService.overlayTranslations(items, {
          entity: '{{name}}',
          fields: ['title', 'desc', 'content'],
          lang,
        });
        const map = new Map(patched.map((i) => [i.id, i]));
        if (nextInfo) patchedNext = map.get(nextInfo.id);
        if (prevInfo) patchedPrev = map.get(prevInfo.id);
      }
    }
    return {
      next: patchedNext || null,
      prev: patchedPrev || null,
      current: currentInfo,
    };
  }

  async create(data: {{entityName}}CreateDto, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('{{cname}}已存在');
    }
    return this.repository.save({
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content: data.content,
      recommend: data.recommend,
      is_available: data.is_available,
      author,
    });
  }

  async remove(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('{{cname}}不存在', '{{name}} not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(data: Partial<{{entityName}}UpdateDto>) {
    const isExisted = await this.repository.findOneBy({
      id: data.id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('{{cname}}不存在', '{{name}} not found');
    }
    return this.repository.update(data.id, {
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content: data.content,
      recommend: data.recommend,
      is_available: data.is_available,
    });
  }
}
