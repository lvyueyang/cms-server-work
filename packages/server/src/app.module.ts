import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { LoggerModule } from './modules/logger/logger.module';
import { NunjucksModule } from './modules/nunjucks/nunjucks.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { UserAdmin } from './modules/user_admin/user_admin.entity';
import { UserAdminModule } from './modules/user_admin/user_admin.module';
import { AdminRole } from './modules/user_admin_role/user_admin_role.entity';
import { AdminRoleModule } from './modules/user_admin_role/user_admin_role.module';
import { ValidateCode } from './modules/validate_code/validate_code.entity';
import { ValidateCodeModule } from './modules/validate_code/validate_code.module';
import { getWorkConfig } from './utils';

const workConfig = getWorkConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.prod.env', '.dev.env', '.default.env'],
      load: [...config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): any => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<string>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [User, UserAdmin, AdminRole, ValidateCode],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'admin-ui/dist'),
      serveRoot: '/' + workConfig.cms_admin_path,
    }),
    NunjucksModule,
    AuthModule,
    UserModule,
    HomeModule,
    UserAdminModule,
    AdminRoleModule,
    ValidateCodeModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}