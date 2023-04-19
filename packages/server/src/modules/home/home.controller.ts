import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { NunjucksService } from '../nunjucks/nunjucks.service';

@Controller()
export class HomeController {
  constructor(private renderService: NunjucksService) {}

  @Get()
  @ApiExcludeEndpoint()
  index() {
    return this.renderService.render('home');
  }
  @Get('/404')
  @ApiExcludeEndpoint()
  pageNotFound() {
    return this.renderService.render('404');
  }
}
