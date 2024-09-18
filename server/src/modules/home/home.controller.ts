import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RenderView } from '../render_view/render_view.decorator';

@Controller()
export class HomeController {
  @Get('/')
  @RenderView()
  @ApiExcludeEndpoint()
  index() {
    return { data: 'HOME' };
  }

  @Get('/404')
  @RenderView()
  @ApiExcludeEndpoint()
  pageNotFound() {
    return null;
  }
}
