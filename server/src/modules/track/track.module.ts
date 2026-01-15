import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackMetaEventModule } from '../track_meta_event/track_meta_event.module';
import { TrackMetaPropertiesModule } from '../track_meta_properties/track_meta_properties.module';
import { TrackController } from './track.controller';
import { TrackEvent, TrackEventProperties } from './track.entity';
import { TrackService } from './track.service';

@Global()
@Module({
  imports: [
    TrackMetaEventModule,
    TrackMetaPropertiesModule,
    TypeOrmModule.forFeature([TrackEvent, TrackEventProperties]),
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
