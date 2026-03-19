import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RenderViewInterceptor } from './render_view.interceptor';
import { ReactNode } from 'react';

export function RenderView(jsxComponent: ReactNode) {
  return applyDecorators(UseInterceptors(RenderViewInterceptor), ApiExcludeEndpoint());
}

export interface RenderViewResultContext {
  req: Request;
  res: Response;
}
