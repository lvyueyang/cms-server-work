import { Global, Module } from '@nestjs/common';
import { RenderViewService } from './render_view.service';
import { RenderViewController } from './render_view.controller';

@Global()
@Module({
  controllers: [RenderViewController],
  providers: [RenderViewService],
  exports: [RenderViewService],
})
export class RenderViewModule {}
