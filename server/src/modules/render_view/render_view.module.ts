import { Global, Module } from '@nestjs/common';
import { RenderViewService } from './render_view.service';

@Global()
@Module({
  providers: [RenderViewService],
  exports: [RenderViewService],
})
export class RenderViewModule {}
