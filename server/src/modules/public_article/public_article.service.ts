import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ContentLang } from '@/constants';
import { CRUDQuery } from '@/interface';
import { createOrder, isDefaultI18nLang } from '@/utils';
import { paginationTransform } from '@/utils/whereTransform';
import { ContentTranslationService, StringKeys } from '../content_translation/content_translation.service';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { PublicArticleCreateDto, PublicArticleUpdateDto } from './public_article.dto';
import { PublicArticle } from './public_article.entity';

@Injectable()
export class PublicArticleService {
  static I18N_KEY = 'public_article';
  static I18N_FIELDS: StringKeys<PublicArticle>[] = ['title', 'desc', 'content'];

  constructor(
    @InjectRepository(PublicArticle)
    private repository: Repository<PublicArticle>,
    private contentTranslationService: ContentTranslationService
  ) {}

  async i18nTrans(res: PublicArticle[], lang?: ContentLang) {
    if (lang && !isDefaultI18nLang(lang)) {
      return this.contentTranslationService.overlayTranslations(res, {
        entity: PublicArticleService.I18N_KEY,
        fields: PublicArticleService.I18N_FIELDS,
        lang,
      });
    }
    return res;
  }

  findAll() {
    return this.repository.find({
      where: { is_delete: false },
    });
  }

  findList({ keyword = '', ...params }: CRUDQuery<PublicArticle>) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('public_article')
      .where({
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('public_article.' + key, value);
    });

    return find.getManyAndCount();
  }

  async findById(id: number) {
    const info = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('开放文章不存在', 'public_article not found');
    }
    return info;
  }

  async findByCode(code: string) {
    const info = await this.repository.findOneBy({
      code,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('开放文章不存在', 'public_article not found');
    }
    return info;
  }

  async create(data: PublicArticleCreateDto, author: UserAdmin) {
    const oldInfo = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (oldInfo) {
      throw new BadRequestException('开放文章已存在');
    }
    return this.repository.save({
      code: data.code,
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content: data.content,
      content_type: data.content_type,
      recommend: data.recommend,
      is_available: data.is_available,
      author,
    });
  }

  async remove(id: number | number[]) {
    return this.repository.update(id, { is_delete: true });
  }

  async update(data: Partial<PublicArticleUpdateDto> & { id: number }) {
    const oldInfo = await this.repository.findOneBy({
      id: data.id,
      is_delete: false,
    });
    if (!oldInfo) {
      throw new BadRequestException('开放文章不存在', 'public_article not found');
    }
    return this.repository.update(data.id, {
      code: data.code,
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      content_type: data.content_type,
      content: data.content,
      recommend: data.recommend,
      is_available: data.is_available,
    });
  }
}
