import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { ContentLang } from '@/constants';
import { CRUDQuery } from '@/interface';
import { createOrder, isDefaultI18nLang } from '../../utils';
import { paginationTransform } from '../../utils/whereTransform';
import { ContentTranslationService, StringKeys } from '../content_translation/content_translation.service';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { BannerCreateDto, BannerUpdateDto } from './banner.dto';
import { Banner } from './banner.entity';

@Injectable()
export class BannerService {
  static I18N_KEY = 'banner';
  static I18N_FIELDS: StringKeys<Banner>[] = ['title', 'desc', 'cover', 'content', 'url'];

  constructor(
    @InjectRepository(Banner)
    private repository: Repository<Banner>,
    private contentTranslationService: ContentTranslationService
  ) {}

  findAll(lang?: ContentLang) {
    return this.repository
      .find({
        where: { is_delete: false },
      })
      .then((res) => {
        if (lang && !isDefaultI18nLang(lang)) {
          return this.contentTranslationService.overlayTranslations(res, {
            entity: BannerService.I18N_KEY,
            fields: BannerService.I18N_FIELDS,
            lang,
          });
        }
        return res;
      });
  }

  findList(
    {
      keyword = '',
      position,
      ...params
    }: CRUDQuery<Banner> & {
      position?: string[];
    },
    lang?: ContentLang
  ) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('banner')
      .where({
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    if (position?.length) {
      find.andWhere({ position: In(position) });
    }
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('banner.' + key, value);
    });

    return find.getManyAndCount().then(([res, count]) => {
      if (lang && !isDefaultI18nLang(lang)) {
        return this.contentTranslationService
          .overlayTranslations(res, {
            entity: BannerService.I18N_KEY,
            fields: BannerService.I18N_FIELDS,
            lang,
          })
          .then((patched) => [patched, count] as const);
      }
      return [res, count] as const;
    });
  }

  async findById(id: number) {
    const isExisted = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('广告不存在', 'banner not found');
    }
    return isExisted;
  }

  async create(data: BannerCreateDto, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('广告已存在');
    }
    return this.repository.save({
      title: data.title,
      desc: data.desc,
      url: data.url,
      cover: data.cover,
      content: data.content,
      recommend: data.recommend,
      position: data.position,
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
      throw new BadRequestException('广告不存在', 'banner not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(data: BannerUpdateDto) {
    const isExisted = await this.repository.findOneBy({
      id: data.id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('广告不存在', 'banner not found');
    }
    return this.repository.update(data.id, {
      title: data.title,
      desc: data.desc,
      cover: data.cover,
      url: data.url,
      content: data.content,
      position: data.position,
      recommend: data.recommend,
      is_available: data.is_available,
    });
  }
}
