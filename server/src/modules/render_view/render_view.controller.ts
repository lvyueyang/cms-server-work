import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RenderViewService } from './render_view.service';

@Controller('/')
export class RenderViewController {
  constructor(private viewService: RenderViewService) {}

  @Get('/_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
