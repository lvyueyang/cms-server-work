import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { RenderViewService } from './render_view.service';

@Controller()
export class RenderViewController {
  constructor(private viewService: RenderViewService) {}

  // @Get('*')
  // public async render(@Req() req: Request, @Res() res: Response) {
  //   await this.viewService.handler(req, res);
  // }
}
