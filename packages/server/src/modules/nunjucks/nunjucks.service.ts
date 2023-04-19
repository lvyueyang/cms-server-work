import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { join } from 'path';

@Injectable()
export class NunjucksService {
  env: nunjucks.Environment;

  constructor() {
    this.initEnv();
  }

  private initEnv() {
    this.env = nunjucks.configure([join(process.cwd(), 'views')], {
      autoescape: true,
      throwOnUndefined: false,
      trimBlocks: true,
      lstripBlocks: false,
      watch: true,
      noCache: process.env.NODE_ENV === 'development' ? true : false,
    });
    this.loadGlobal();
    this.env.addGlobal('static', '/_fe/static');
  }

  render(name: string, context?: object) {
    return this.env.render(name + '.njk', context);
  }

  async loadGlobal() {
    // const [[news]] = await Promise.all([]);
    // this.env.addGlobal('header', {
    //   news,
    // });
  }
}
