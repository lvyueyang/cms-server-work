import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RenderView } from '../render_view/render_view.decorator';

@Controller()
export class HomeController {
  @RenderView('/')
  @ApiExcludeEndpoint()
  index() {
    return { data: 'HOME' };
  }

  @RenderView('/404')
  @ApiExcludeEndpoint()
  pageNotFound() {
    return null;
  }
}
