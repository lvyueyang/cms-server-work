import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, LessThan, Like, MoreThan, Repository } from "typeorm";
import { BUSINESS_CONFIG_PRESET } from "@/common/business_config";
import { ContentLang } from "@/constants";
import { CRUDQuery } from "@/interface";
import { createOrder, isDefaultI18nLang } from "@/utils";
import { paginationTransform } from "@/utils/whereTransform";
import { ContentTranslation } from "../content_translation/content_translation.entity";
import {
	ContentTranslationService,
	StringKeys,
} from "../content_translation/content_translation.service";
import { SystemConfig } from "../system_config/system_config.entity";
import { UserAdmin } from "../user_admin/user_admin.entity";
import {
	BusinessConfigCreateDto,
	BusinessConfigUpdateDto,
} from "./business_config.dto";
import { BusinessConfig } from "./business_config.entity";

@Injectable()
export class BusinessConfigService {
	static I18N_KEY = "business_config";
	static I18N_FIELDS: StringKeys<BusinessConfig>[] = ["title", "content"];

	constructor(
		@InjectRepository(BusinessConfig)
		private repository: Repository<BusinessConfig>,
		@InjectRepository(SystemConfig)
		private systemConfigRepository: Repository<SystemConfig>,
		@InjectRepository(ContentTranslation)
		private contentTranslationRepository: Repository<ContentTranslation>,
		private contentTranslationService: ContentTranslationService,
	) {}

	async onApplicationBootstrap() {
		await this.migratePresetFromSystemConfig();
		await this.importPreset();
	}

	findAll() {
		return this.repository.find({
			where: { is_delete: false },
		});
	}

	findList(
		{ keyword = "", ...params }: CRUDQuery<BusinessConfig>,
		lang?: ContentLang,
	) {
		const { skip, take } = paginationTransform(params);
		const { order } = createOrder(params) || {};
		const find = this.repository
			.createQueryBuilder("business_config")
			.where({
				is_delete: false,
				title: Like(`%${keyword.trim()}%`),
			})
			.skip(skip)
			.take(take);
		Object.entries(order || {}).forEach(([key, value]) => {
			find.addOrderBy(`business_config.${key}`, value);
		});

		return find.getManyAndCount().then(async ([list, total]) => {
			if (lang && !isDefaultI18nLang(lang)) {
				const patched =
					await this.contentTranslationService.overlayTranslations(list, {
						entity: BusinessConfigService.I18N_KEY,
						fields: BusinessConfigService.I18N_FIELDS,
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
			return this.contentTranslationService.overlayTranslations(list, {
				entity: BusinessConfigService.I18N_KEY,
				fields: BusinessConfigService.I18N_FIELDS,
				lang,
			});
		}
		return list;
	}

	async findById(id: number, lang?: ContentLang) {
		const info = await this.repository.findOneBy({
			id,
			is_delete: false,
		});
		if (!info) {
			throw new BadRequestException(
				"业务配置不存在",
				"business_config not found",
			);
		}
		if (lang && !isDefaultI18nLang(lang)) {
			const [patched] =
				await this.contentTranslationService.overlayTranslations([info], {
					entity: BusinessConfigService.I18N_KEY,
					fields: BusinessConfigService.I18N_FIELDS,
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
					id: "DESC",
				},
			}),
			this.repository.findOne({
				where: {
					id: MoreThan(id),
					is_delete: false,
				},
				order: {
					id: "ASC",
				},
			}),
		]);

		let patchedNext = nextInfo;
		let patchedPrev = prevInfo;
		if (lang && !isDefaultI18nLang(lang)) {
			const items = [nextInfo, prevInfo].filter(
				(item): item is BusinessConfig => Boolean(item),
			);
			if (items.length) {
				const patched =
					await this.contentTranslationService.overlayTranslations(items, {
						entity: BusinessConfigService.I18N_KEY,
						fields: BusinessConfigService.I18N_FIELDS,
						lang,
					});
				const map = new Map(patched.map((item) => [item.id, item]));
				if (nextInfo) patchedNext = map.get(nextInfo.id) || nextInfo;
				if (prevInfo) patchedPrev = map.get(prevInfo.id) || prevInfo;
			}
		}
		return {
			next: patchedNext,
			prev: patchedPrev,
			current: currentInfo,
		};
	}

	async create(data: BusinessConfigCreateDto, author: UserAdmin) {
		const isExisted = await this.repository.findOneBy({
			code: data.code,
			is_delete: false,
		});
		if (isExisted) {
			throw new BadRequestException("业务配置编码已存在");
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
			throw new BadRequestException(
				"业务配置不存在",
				"business_config not found",
			);
		}
		return this.repository.update(id, { is_delete: true });
	}

	async update(data: Partial<BusinessConfigUpdateDto> & { id: number }) {
		const isExisted = await this.repository.findOneBy({
			id: data.id,
			is_delete: false,
		});
		if (!isExisted) {
			throw new BadRequestException(
				"业务配置不存在",
				"business_config not found",
			);
		}
		return this.repository.update(data.id, {
			title: data.title,
			content_type: data.content_type,
			content: data.content,
			is_available: data.is_available,
		});
	}

	async importPreset() {
		for (const [code, value] of Object.entries(BUSINESS_CONFIG_PRESET)) {
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
				continue;
			}

			try {
				await this.repository.save({
					code,
					title: value.title,
					content_type: value.content_type,
					content: this.stringifyPresetContent(value.content),
				});
			} catch (e) {
				console.warn(`Failed to create business config ${code}:`, e);
			}
		}
		return true;
	}

	private stringifyPresetContent(
		content: (typeof BUSINESS_CONFIG_PRESET)[string]["content"],
	) {
		if (typeof content === "string") {
			return content;
		}
		if (content) {
			return JSON.stringify(content, null, 2);
		}
		return "";
	}

	private async migratePresetFromSystemConfig() {
		const presetCodes = Object.keys(BUSINESS_CONFIG_PRESET);

		for (const code of presetCodes) {
			const [target, legacy] = await Promise.all([
				this.repository.findOne({
					where: {
						code,
					},
				}),
				this.systemConfigRepository.findOne({
					where: {
						code,
						is_delete: false,
					},
				}),
			]);

			if (!legacy) {
				continue;
			}

			const currentTarget =
				target ||
				(await this.repository.save({
					code: legacy.code,
					title: legacy.title,
					content_type: legacy.content_type,
					content: legacy.content,
					is_available: legacy.is_available,
				}));

			if (target?.is_delete) {
				await this.repository.update(target.id, {
					is_delete: false,
				});
			}

			await this.migrateTranslations(legacy.id, currentTarget.id);
			await this.systemConfigRepository.update(legacy.id, {
				is_delete: true,
			});
		}
	}

	private async migrateTranslations(
		fromSystemConfigId: number,
		toBusinessConfigId: number,
	) {
		const translations = await this.contentTranslationRepository.find({
			where: {
				entity: "system_config",
				entityId: String(fromSystemConfigId),
			},
		});
		if (!translations.length) {
			return;
		}

		await this.contentTranslationService.mulitUpsert(
			translations.map((item) => ({
				entity: BusinessConfigService.I18N_KEY,
				entityId: toBusinessConfigId,
				field: item.field,
				lang: item.lang,
				value: item.value,
			})),
		);
	}
}
