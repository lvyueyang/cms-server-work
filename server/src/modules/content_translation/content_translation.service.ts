import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ContentTranslation } from './content_translation.entity';
import { ContentLang } from '@/constants';
import { ContentTranslationQueryListDto } from './content_translation.dto';
import { paginationTransform } from '@/utils/whereTransform';
import { createOrder } from '@/utils';

type StringKeys<T> = {
  [P in keyof T]-?: T[P] extends string | null | undefined ? P : never;
}[keyof T];
interface UpsertParams {
  entity: string;
  entityId: number;
  field: string;
  lang: ContentLang | string;
  value: string;
}

@Injectable()
export class ContentTranslationService {
  constructor(
    @InjectRepository(ContentTranslation)
    private repository: Repository<ContentTranslation>,
  ) {}

  async queryList({
    entity,
    field,
    lang,
    ...params
  }: ContentTranslationQueryListDto) {
    const { skip, take } = paginationTransform(params);
    const { order } = createOrder(params) || {};
    const find = this.repository
      .createQueryBuilder('content_translation')
      .skip(skip)
      .take(take);
    if (entity) {
      find.andWhere({
        entity: entity,
      });
    }
    if (lang) {
      const langChain = this.resolveLangChain(lang);
      find.andWhere({
        lang: In(langChain),
      });
    }
    if (field) {
      find.andWhere({
        field: field,
      });
    }
    Object.entries(order || {}).forEach(([key, value]) => {
      find.addOrderBy('content_translation.' + key, value);
    });
    return find.getManyAndCount();
  }

  private toEnumLang(lang: ContentLang | string): ContentLang {
    return String(lang) as ContentLang;
  }

  // 解析语言链
  resolveLangChain(lang?: ContentLang | string) {
    const fallback = [ContentLang.ZH_CN];
    if (!lang) return fallback.map(String);
    const input = String(lang);
    const parts = input.split('-');
    const generic = parts[0];
    const chain = [input];
    if (generic && generic !== input) chain.push(generic);
    return [...chain, ...fallback].map(String);
  }

  // 添加或更新翻译
  async upsert(params: UpsertParams) {
    const existed = await this.repository.findOne({
      where: {
        entity: params.entity,
        entityId: params.entityId,
        field: params.field,
        lang: this.toEnumLang(params.lang),
      },
    });
    if (existed) {
      await this.repository.update(existed.id, {
        ...params,
        lang: this.toEnumLang(params.lang),
      });
      return existed.id;
    }
    const payload = this.repository.create({
      entity: params.entity,
      entityId: params.entityId,
      field: params.field,
      lang: this.toEnumLang(params.lang),
      value: params.value,
    });
    const created = await this.repository.save(payload);
    return created.id;
  }
  // 批量添加或者更新翻译
  async mulitUpsert(translations: UpsertParams[]) {
    if (!translations.length) return [];

    // 构建复合查询条件
    const conditions = translations.map((t) => ({
      entity: t.entity,
      entityId: t.entityId,
      field: t.field,
      lang: this.toEnumLang(t.lang),
    }));

    // 批量查询已存在的记录
    const existingRecords = await this.repository.find({
      where: conditions,
    });

    // 创建现有记录的映射，方便快速查找
    const existingMap = new Map<string, ContentTranslation>();
    existingRecords.forEach((record) => {
      const key = `${record.entity}-${record.entityId}-${record.field}-${record.lang}`;
      existingMap.set(key, record);
    });

    const toUpdate: ContentTranslation[] = [];
    const toCreate: ContentTranslation[] = [];
    const results: number[] = [];

    // 分类处理：更新 vs 创建
    translations.forEach((translation) => {
      const lang = this.toEnumLang(translation.lang);
      const key = `${translation.entity}-${translation.entityId}-${translation.field}-${lang}`;
      const existing = existingMap.get(key);

      if (existing) {
        // 更新现有记录
        existing.value = translation.value;
        existing.entity = translation.entity;
        existing.entityId = translation.entityId;
        existing.field = translation.field;
        existing.lang = lang;
        toUpdate.push(existing);
        results.push(existing.id);
      } else {
        // 创建新记录
        const newRecord = this.repository.create({
          entity: translation.entity,
          entityId: translation.entityId,
          field: translation.field,
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

  // 批量查询翻译
  async fetchMap<T extends { id: number }, K extends StringKeys<T>>(options: {
    entity: string;
    ids: number[];
    fields: K[];
    lang?: ContentLang | string;
  }) {
    const { entity, ids, fields, lang } = options;
    if (!ids.length || !fields.length) return;
    const chain = this.resolveLangChain(lang);
    const rows = await this.repository.find({
      where: {
        entity,
        entityId: In(ids),
        field: In(fields as string[]),
        lang: In(chain.map((l) => this.toEnumLang(l)) as ContentLang[]),
      },
    });
    const byId = new Map<number, Partial<Record<K, string>>>();
    const ranks = new Map<number, Map<K, number>>();
    ids.forEach((id) => {
      byId.set(id, {} as Partial<Record<K, string>>);
      ranks.set(id, new Map<K, number>());
    });
    rows.forEach((r) => {
      const current = byId.get(r.entityId);
      const field = r.field as K;
      const rankChain = ranks.get(r.entityId);
      const prevRank = rankChain.get(field) ?? Infinity;
      const rank = chain.indexOf(String(r.lang));
      if (rank !== -1 && rank < prevRank) {
        current[field] = r.value;
        rankChain.set(field, rank);
      }
    });
    return byId;
  }

  // 应用翻译
  applyOverlay<T extends { id: number }, K extends StringKeys<T>>(
    items: T[],
    map: Map<number, Partial<Record<K, string>>>,
    fields: K[],
  ) {
    return items.map((item) => {
      const overlay = map.get(item.id);
      if (!overlay) return item;
      const patched = { ...item };
      fields.forEach((f) => {
        const v = overlay[f];
        if (v !== undefined) (patched as any)[f] = v as string;
      });
      return patched;
    });
  }

  // 批量应用翻译 (fetchMap + applyOverlay)
  async overlayTranslations<T extends { id: number }, K extends StringKeys<T>>(
    items: T[],
    options: {
      entity: string;
      fields: K[];
      lang: ContentLang | string;
    },
  ) {
    if (!items.length || !options.fields.length) return items;
    const map = await this.fetchMap<T, K>({
      entity: options.entity,
      ids: items.map((i) => i.id),
      fields: options.fields,
      lang: options.lang,
    });
    return this.applyOverlay<T, K>(items, map, options.fields);
  }

  async query(params: {
    entity: string;
    entityId?: number;
    field?: string;
    lang?: ContentLang | string;
  }) {
    const where: Partial<ContentTranslation> = { entity: params.entity };
    if (params.entityId !== undefined) where.entityId = params.entityId;
    if (params.field) where.field = params.field;
    if (params.lang) where.lang = this.toEnumLang(params.lang);
    return this.repository.find({ where });
  }
}
