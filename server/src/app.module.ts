import { join } from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { NotFoundFilter } from './common/filters/not-found.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import config from './config';
import { createSqliteNestOptions, isDevSynchronizeEnabled } from './db/sqlite-options';
import { AuthModule } from './modules/auth/auth.module';
import { BannerModule } from './modules/banner/banner.module';
import { ContentTranslationModule } from './modules/content_translation/content_translation.module';
import { DictTypeModule } from './modules/dict_type/dict_type.module';
import { DictValueModule } from './modules/dict_value/dict_value.module';
import { FileManageModule } from './modules/file_manage/file_manage.module';
import { HomeModule } from './modules/home/home.module';
import { LoggerModule } from './modules/logger/logger.module';
import { NewsModule } from './modules/news/news.module';
import { PublicArticleModule } from './modules/public_article/public_article.module';
import { RenderViewModule } from './modules/render_view/render_view.module';
import { ResultPageModule } from './modules/result_page/result_page.module';
import { SystemConfigModule } from './modules/system_config/system_config.module';
import { SystemTranslationModule } from './modules/system_translation/system_translation.module';
import { TrackModule } from './modules/track/track.module';
import { TrackMetaEventModule } from './modules/track_meta_event/track_meta_event.module';
import { TrackMetaPropertiesModule } from './modules/track_meta_properties/track_meta_properties.module';
import { UserAdminModule } from './modules/user_admin/user_admin.module';
import { AdminRoleModule } from './modules/user_admin_role/user_admin_role.module';
import { UserClientModule } from './modules/user_client/user_client.module';
import { ValidateCodeModule } from './modules/validate_code/validate_code.module';
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
        const nodeEnv = configService.get<string>('NODE_ENV') || process.env.NODE_ENV || 'development';
        const synchronize = isDevSynchronizeEnabled(nodeEnv, configService.get<string>('TYPEORM_SYNCHRONIZE'));
        return createSqliteNestOptions({
          databasePath: configService.get<string>('DATABASE_PATH'),
          synchronize,
        });
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
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
