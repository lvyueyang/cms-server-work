import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackMetaPropertiesController } from './track_meta_properties.controller';
import { TrackMetaProperties } from './track_meta_properties.entity';
import { TrackMetaPropertiesService } from './track_meta_properties.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrackMetaProperties])],
  controllers: [TrackMetaPropertiesController],
  providers: [TrackMetaPropertiesService],
  exports: [TrackMetaPropertiesService],
})
export class TrackMetaPropertiesModule {}
