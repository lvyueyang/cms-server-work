import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {{entityName}}Controller } from './{{name}}.controller';
import { {{entityName}} } from './{{name}}.entity';
import { {{entityName}}Service } from './{{name}}.service';

@Module({
  imports: [TypeOrmModule.forFeature([{{entityName}}])],
  controllers: [{{entityName}}Controller],
  providers: [{{entityName}}Service],
})
export class {{entityName}}Module {}
