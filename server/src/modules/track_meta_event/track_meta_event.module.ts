import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackMetaPropertiesModule } from '../track_meta_properties/track_meta_properties.module';
import { TrackMetaEventController } from './track_meta_event.controller';
import { TrackMetaEvent } from './track_meta_event.entity';
import { TrackMetaEventService } from './track_meta_event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackMetaEvent]),
    TrackMetaPropertiesModule,
  ],
  controllers: [TrackMetaEventController],
  providers: [TrackMetaEventService],
  exports: [TrackMetaEventService],
})
export class TrackMetaEventModule {}
