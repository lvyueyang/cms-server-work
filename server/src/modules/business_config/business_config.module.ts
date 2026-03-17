import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentTranslation } from "../content_translation/content_translation.entity";
import { SystemConfig } from "../system_config/system_config.entity";
import { BusinessConfigController } from "./business_config.controller";
import { BusinessConfig } from "./business_config.entity";
import { BusinessConfigService } from "./business_config.service";

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			BusinessConfig,
			SystemConfig,
			ContentTranslation,
		]),
	],
	controllers: [BusinessConfigController],
	providers: [BusinessConfigService],
	exports: [BusinessConfigService],
})
export class BusinessConfigModule {}
