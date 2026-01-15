import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NotFoundFilter } from './common/filters/not-found.filter';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { Banner } from './modules/banner/banner.entity';
import { BannerModule } from './modules/banner/banner.module';
import { ContentTranslation } from './modules/content_translation/content_translation.entity';
import { ContentTranslationModule } from './modules/content_translation/content_translation.module';
import { DictType } from './modules/dict_type/dict_type.entity';
import { DictTypeModule } from './modules/dict_type/dict_type.module';
import { DictValue } from './modules/dict_value/dict_value.entity';
import { DictValueModule } from './modules/dict_value/dict_value.module';
import { FileManage } from './modules/file_manage/file_manage.entity';
import { FileManageModule } from './modules/file_manage/file_manage.module';
import { HomeModule } from './modules/home/home.module';
import { LoggerModule } from './modules/logger/logger.module';
import { News } from './modules/news/news.entity';
import { NewsModule } from './modules/news/news.module';
import { PublicArticle } from './modules/public_article/public_article.entity';
import { PublicArticleModule } from './modules/public_article/public_article.module';
import { RenderViewModule } from './modules/render_view/render_view.module';
import { ResultPageModule } from './modules/result_page/result_page.module';
import { SystemConfig } from './modules/system_config/system_config.entity';
import { SystemConfigModule } from './modules/system_config/system_config.module';
import { SystemTranslation } from './modules/system_translation/system_translation.entity';
import { SystemTranslationModule } from './modules/system_translation/system_translation.module';
import { TrackEvent, TrackEventProperties } from './modules/track/track.entity';
import { TrackModule } from './modules/track/track.module';
import { TrackMetaEvent } from './modules/track_meta_event/track_meta_event.entity';
import { TrackMetaEventModule } from './modules/track_meta_event/track_meta_event.module';
import { TrackMetaProperties } from './modules/track_meta_properties/track_meta_properties.entity';
import { TrackMetaPropertiesModule } from './modules/track_meta_properties/track_meta_properties.module';
import { UserAdmin } from './modules/user_admin/user_admin.entity';
import { UserAdminModule } from './modules/user_admin/user_admin.module';
import { AdminRole } from './modules/user_admin_role/user_admin_role.entity';
import { AdminRoleModule } from './modules/user_admin_role/user_admin_role.module';
import { UserClient } from './modules/user_client/user_client.entity';
import { UserClientModule } from './modules/user_client/user_client.module';
import { ValidateCode } from './modules/validate_code/validate_code.entity';
import { ValidateCodeModule } from './modules/validate_code/validate_code.module';
import { WebhookTrans } from './modules/webhook_trans/webhook_trans.entity';
import { WebhookTransModule } from './modules/webhook_trans/webhook_trans.module';
import { getWorkConfig } from './utils';

const workConfig = getWorkConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.prod.env', 'env/.dev.env'],
      load: [...config],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'mysql',
          retryAttempts: 3,
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [
            UserClient,
            UserAdmin,
            AdminRole,
            ValidateCode,
            WebhookTrans,
            FileManage,
            ContentTranslation,
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
          ],
          synchronize: true,
          timezone: 'Z',
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'admin-ui/dist'),
      serveRoot: `/${workConfig.cms_admin_path}`,
    }),
    RenderViewModule,
    AuthModule,
    UserClientModule,
    UserAdminModule,
    AdminRoleModule,
    ValidateCodeModule,
    LoggerModule,
    WebhookTransModule,
    FileManageModule,
    ContentTranslationModule, // 国际化-数据库字段翻译
    SystemTranslationModule, // 国际化-硬编码字段翻译
    DictTypeModule,
    DictValueModule,
    SystemConfigModule,
    TrackMetaEventModule,
    TrackMetaPropertiesModule,
    TrackModule,

    HomeModule,
    NewsModule,
    BannerModule,
    PublicArticleModule,
    ResultPageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
  ],
})
export class AppModule {}
