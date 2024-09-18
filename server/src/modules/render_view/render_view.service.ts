import { Injectable, OnModuleInit } from '@nestjs/common';
import { Request, Response } from 'express';
import * as nextServer from 'next';
import { NextServer, NextServerOptions } from 'next/dist/server/next';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class RenderViewService implements OnModuleInit {
  private server: NextServer;
  globalData = {};

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const dir = path.join(process.cwd(), '../', 'clients/fe');
    const dev = this.configService.get<string>('NODE_ENV') !== 'production';
    const conf: NextServerOptions = {
      dev,
      dir,
    };
    try {
      this.server = (nextServer as any)(conf);
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  handler(req: Request, res: Response, context?: any) {
    // @ts-ignore
    req.pageData = context;
    // @ts-ignore
    req.globalData = this.globalData;
    return this.server.getRequestHandler()(req, res);
  }

  render(name: string, context?: object) {
    return '';
    // return this.env.render(name + '.njk', context);
  }

  async loadGlobal() {
    // const [[news]] = await Promise.all([]);
    // this.env.addGlobal('header', {
    //   news,
    // });
  }
}
