import { Banner } from "@/modules/banner/banner.entity";
import { BusinessConfig } from "@/modules/business_config/business_config.entity";
import { ContentTranslation } from "@/modules/content_translation/content_translation.entity";
import { DictType } from "@/modules/dict_type/dict_type.entity";
import { DictValue } from "@/modules/dict_value/dict_value.entity";
import { FileManage } from "@/modules/file_manage/file_manage.entity";
import { News } from "@/modules/news/news.entity";
import { PublicArticle } from "@/modules/public_article/public_article.entity";
import { SystemConfig } from "@/modules/system_config/system_config.entity";
import { SystemTranslation } from "@/modules/system_translation/system_translation.entity";
import { TrackEvent, TrackEventProperties } from "@/modules/track/track.entity";
import { TrackMetaEvent } from "@/modules/track_meta_event/track_meta_event.entity";
import { TrackMetaProperties } from "@/modules/track_meta_properties/track_meta_properties.entity";
import { UserAdmin } from "@/modules/user_admin/user_admin.entity";
import { AdminRole } from "@/modules/user_admin_role/user_admin_role.entity";
import { UserClient } from "@/modules/user_client/user_client.entity";
import { ValidateCode } from "@/modules/validate_code/validate_code.entity";
import { WebhookTrans } from "@/modules/webhook_trans/webhook_trans.entity";

export const SERVER_ENTITIES = [
	UserClient,
	UserAdmin,
	AdminRole,
	ValidateCode,
	WebhookTrans,
	FileManage,
	ContentTranslation,
	BusinessConfig,
	DictType,
	DictValue,
	SystemTranslation,
	SystemConfig,
	TrackMetaEvent,
	TrackMetaProperties,
	TrackEvent,
	TrackEventProperties,
	News,
	Banner,
	PublicArticle,
] as const;
