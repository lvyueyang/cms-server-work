import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RenderView } from '../render_view/render_view.decorator';

@Controller()
export class HomeController {
  @Get()
  @RenderView('home')
  @ApiExcludeEndpoint()
  index() {
    return null;
  }

  @Get('/404')
  @RenderView('404')
  @ApiExcludeEndpoint()
  pageNotFound() {
    return null;
  }
}
