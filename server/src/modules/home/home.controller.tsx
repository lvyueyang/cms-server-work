import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';

@Controller()
export class HomeController {
  @RenderView()
  @ApiExcludeEndpoint()
  @Get('/')
  index() {
    return new RenderViewResult({
      title: '首页',
      description: '这是一个使用JSX直接渲染的页面。',
      meta: {
        keywords: '首页, 示例, JSX',
      },
      layout: 'base',
      render() {
        return (
          <>
            <h1>首页</h1>
            <p>这是一个使用JSX直接渲染的页面。</p>
            <div style={{ marginTop: '20px' }}>
              <h3>系统特性</h3>
              <ul>
                <li>简单易用</li>
                <li>高性能</li>
                <li>可扩展</li>
                <li>响应式设计</li>
                <li>SEO友好</li>
              </ul>
            </div>
          </>
        );
      },
    });
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
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ color: '#dc3545' }}>404 - 页面未找到</h1>
            <p>抱歉，您访问的页面不存在。</p>
            <a href="/" style={{ color: '#007bff' }}>
              返回首页
            </a>
          </div>
        );
      },
    });
  }
}
