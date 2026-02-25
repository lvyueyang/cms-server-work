import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Lang from '@/common/lang.decorator';
import { ContentLang, FE_PREFIX } from '@/constants';
import { HomePage, NotFoundPage } from '@/views';
import { BannerService } from '../banner/banner.service';
import { NewsService } from '../news/news.service';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';

@Controller()
export class HomeController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly newsService: NewsService,
  ) {}

  @RenderView()
  @Get('/')
  async index(@Lang() lang: ContentLang) {
    const [[banners], [news]] = await Promise.all([
      this.bannerService.findList(
        {
          position: ['home_top'],
          is_available: true,
          current: 1,
          page_size: 20,
          order_key: 'recommend',
          order_type: 'DESC',
        },
        lang,
      ),
      this.newsService.findList(
        {
          is_available: true,
          current: 1,
          page_size: 1,
          order_key: 'recommend',
          order_type: 'DESC',
        },
        lang,
      ),
    ]);
    return new RenderViewResult({
      title: '首页',
      layout: 'base',
      scripts: [`${FE_PREFIX}/home.js`],
      styles: [`${FE_PREFIX}/home.css`],
      render() {
        return (
          <HomePage
            banners={banners}
            news={news[0]}
          />
        );
      },
    });
  }

  @Get(['/en', '/en/*'])
  @ApiExcludeEndpoint()
  enPage(@Req() req: Request, @Res() res: Response) {
    // 设置语言cookie为en
    res.cookie('lang', ContentLang.EN_US);

    // 获取原始路径，去掉开头的/en
    const originalUrl = req.url;
    const redirectPath = originalUrl.replace(/^\/en/, '') || '/';

    // 重定向到去掉/en的路径
    res.redirect(redirectPath);
    return;
  }

  @Get(['/zh', '/zh/*'])
  @ApiExcludeEndpoint()
  zhPage(@Req() req: Request, @Res() res: Response) {
    // 设置语言cookie为zh
    res.cookie('lang', ContentLang.ZH_CN);

    // 获取原始路径，去掉开头的/zh
    const originalUrl = req.url;
    const redirectPath = originalUrl.replace(/^\/zh/, '') || '/';

    // 重定向到去掉/zh的路径
    res.redirect(redirectPath);
    return;
  }

  @RenderView()
  @ApiExcludeEndpoint()
  @Get('/404')
  pageNotFound() {
    return new RenderViewResult({
      title: '404 - 页面未找到',
      description: '抱歉，您访问的页面不存在。',
      meta: {
        keywords: '404, 页面未找到, 错误',
      },
      layout: 'base',
      render() {
        return <NotFoundPage />;
      },
    });
  }
}
