import { Global, Module } from '@nestjs/common';
import { RenderViewController } from './render_view.controller';
import { RenderViewService } from './render_view.service';

@Global()
@Module({
  imports: [],
  controllers: [RenderViewController],
  providers: [RenderViewService],
  exports: [RenderViewService],
})
export class RenderViewModule {}
