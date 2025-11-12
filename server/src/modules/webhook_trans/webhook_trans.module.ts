import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookTransController } from './webhook_trans.controller';
import { WebhookTrans } from './webhook_trans.entity';
import { WebhookTransService } from './webhook_trans.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookTrans])],
  controllers: [WebhookTransController],
  providers: [WebhookTransService],
})
export class WebhookTransModule {}
