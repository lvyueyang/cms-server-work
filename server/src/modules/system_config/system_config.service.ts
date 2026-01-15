import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Like, MoreThan, Repository } from 'typeorm';
import { SYSTEM_CONFIG_PRESET } from '@/common/system_config';
import { ContentLang } from '@/constants';
import { CRUDQuery } from '@/interface';
import { createOrder, isDefaultI18nLang } from '@/utils';
import { paginationTransform } from '@/utils/whereTransform';
import { ContentTranslationService, StringKeys } from '../content_translation/content_translation.service';
import { UserAdmin } from '../user_admin/user_admin.entity';
import { SystemConfigCreateDto, SystemConfigUpdateDto } from './system_config.dto';
import { SystemConfig } from './system_config.entity';

@Injectable()
export class SystemConfigService {
  static I18N_KEY = 'system_config';
  static I18N_FIELDS: StringKeys<SystemConfig>[] = ['title', 'content'];

  constructor(
    @InjectRepository(SystemConfig)
    private repository: Repository<SystemConfig>,
    private contentTranslationService: ContentTranslationService
  ) {}

  onApplicationBootstrap() {
    this.importPreset();
  }

  findAll() {
    return this.repository.find({
      where: { is_delete: false },
    });
  }

  findList({ keyword = '', ...params }: CRUDQuery<SystemConfig>, lang?: ContentLang) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('system_config')
      .where({
        is_delete: false,
        title: Like(`%${keyword.trim()}%`),
      })
      .skip(skip)
      .take(take);
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('system_config.' + key, value);
    });

    return find.getManyAndCount().then(async ([list, total]) => {
      if (lang && !isDefaultI18nLang(lang)) {
        const patched = await this.contentTranslationService.overlayTranslations(list, {
          entity: SystemConfigService.I18N_KEY,
          fields: SystemConfigService.I18N_FIELDS,
          lang,
        });
        return [patched, total] as const;
      }
      return [list, total] as const;
    });
  }

  async findByCodes(codes: string[], lang?: ContentLang) {
    const list = await this.repository.find({
      where: {
        code: In(codes),
        is_delete: false,
      },
    });
    if (lang && !isDefaultI18nLang(lang)) {
      const result = await this.contentTranslationService.overlayTranslations(list, {
        entity: SystemConfigService.I18N_KEY,
        fields: SystemConfigService.I18N_FIELDS,
        lang,
      });
      return result;
    }
    return list;
  }

  async findById(id: number, lang?: ContentLang) {
    const info = await this.repository.findOneBy({
      id,
      is_delete: false,
    });
    if (!info) {
      throw new BadRequestException('系统配置不存在', 'system_config not found');
    }
    if (lang && !isDefaultI18nLang(lang)) {
      const [patched] = await this.contentTranslationService.overlayTranslations([info], {
        entity: SystemConfigService.I18N_KEY,
        fields: SystemConfigService.I18N_FIELDS,
        lang,
      });
      return patched;
    }
    return info;
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

    let patchedNext = nextInfo;
    let patchedPrev = prevInfo;
    if (lang && !isDefaultI18nLang(lang)) {
      const items = ([nextInfo!, prevInfo!] as const).filter(Boolean);
      if (items.length) {
        const patched = await this.contentTranslationService.overlayTranslations(items, {
          entity: SystemConfigService.I18N_KEY,
          fields: SystemConfigService.I18N_FIELDS,
          lang,
        });
        const map = new Map(patched.map((i) => [i.id, i]));
        if (nextInfo) patchedNext = map.get(nextInfo.id)!;
        if (prevInfo) patchedPrev = map.get(prevInfo.id)!;
      }
    }
    return {
      next: patchedNext,
      prev: patchedPrev,
      current: currentInfo,
    };
  }

  async create(data: SystemConfigCreateDto, author: UserAdmin) {
    const isExisted = await this.repository.findOneBy({
      title: data.title,
      is_delete: false,
    });
    if (isExisted) {
      throw new BadRequestException('系统配置已存在');
    }
    return this.repository.save({
      title: data.title,
      code: data.code,
      content_type: data.content_type,
      content: data.content,
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
      throw new BadRequestException('系统配置不存在', 'system_config not found');
    }
    return this.repository.update(id, { is_delete: true });
  }

  async update(data: Partial<SystemConfigUpdateDto> & { id: number }) {
    const isExisted = await this.repository.findOneBy({
      id: data.id,
      is_delete: false,
    });
    if (!isExisted) {
      throw new BadRequestException('系统配置不存在', 'system_config not found');
    }
    return this.repository.update(data.id, {
      title: data.title,
      content_type: data.content_type,
      content: data.content,
      is_available: data.is_available,
    });
  }

  async importPreset() {
    for (const [code, value] of Object.entries(SYSTEM_CONFIG_PRESET)) {
      const info = await this.repository.findOne({
        where: {
          code,
        },
      });
      if (info) {
        if (info.is_delete) {
          await this.repository.update(info.id, {
            is_delete: false,
          });
        }
      } else {
        try {
          let content = '';
          if (value.content) {
            if (typeof value.content === 'object') {
              content = JSON.stringify(value.content, null, 2);
            }
            if (typeof value.content === 'string') {
              content = value.content;
            }
          }
          await this.repository.save({
            code,
            title: value.title,
            content_type: value.content_type,
            content: content,
          });
        } catch (e) {
          console.warn(`Failed to create dict type ${code}:`, e);
        }
      }
    }
    return true;
  }
}
