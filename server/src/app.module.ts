import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import config from './config';
import { NotFoundFilter } from './common/filters/not-found.filter';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { LoggerModule } from './modules/logger/logger.module';
import { News } from './modules/news/news.entity';
import { NewsModule } from './modules/news/news.module';
import { RenderViewModule } from './modules/render_view/render_view.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { UserAdmin } from './modules/user_admin/user_admin.entity';
import { UserAdminModule } from './modules/user_admin/user_admin.module';
import { AdminRole } from './modules/user_admin_role/user_admin_role.entity';
import { AdminRoleModule } from './modules/user_admin_role/user_admin_role.module';
import { ValidateCode } from './modules/validate_code/validate_code.entity';
import { ValidateCodeModule } from './modules/validate_code/validate_code.module';
import { getWorkConfig } from './utils';
import { Banner } from './modules/banner/banner.entity';
import { BannerModule } from './modules/banner/banner.module';
import { WebhookTrans } from './modules/webhook_trans/webhook_trans.entity';
import { WebhookTransModule } from './modules/webhook_trans/webhook_trans.module';
import { FileManage } from './modules/file_manage/file_manage.entity';
import { FileManageModule } from './modules/file_manage/file_manage.module';
import { ContentTranslation } from './modules/content_translation/content_translation.entity';
import { ContentTranslationModule } from './modules/content_translation/content_translation.module';
import { DictType } from './modules/dict_type/dict_type.entity';
import { DictValue } from './modules/dict_value/dict_value.entity';
import { DictTypeModule } from './modules/dict_type/dict_type.module';
import { DictValueModule } from './modules/dict_value/dict_value.module';

const workConfig = getWorkConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.prod.env', 'env/.dev.env'],
      load: [...config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [
            User,
            UserAdmin,
            AdminRole,
            ValidateCode,
            WebhookTrans,
            FileManage,
            ContentTranslation,
            DictType,
            DictValue,
            News,
            Banner,
          ],
          synchronize: true,
          timezone: 'Z',
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'admin-ui/dist'),
      serveRoot: '/' + workConfig.cms_admin_path,
    }),
    HomeModule,
    RenderViewModule,
    AuthModule,
    UserModule,
    UserAdminModule,
    AdminRoleModule,
    ValidateCodeModule,
    LoggerModule,
    WebhookTransModule,
    FileManageModule,
    ContentTranslationModule,
    DictTypeModule,
    DictValueModule,

    NewsModule,
    BannerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
