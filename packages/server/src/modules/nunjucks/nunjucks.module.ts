import { Global, Module } from '@nestjs/common';
import { NunjucksService } from './nunjucks.service';

@Global()
@Module({
  providers: [NunjucksService],
  exports: [NunjucksService],
})
export class NunjucksModule {}
