import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FE_PREFIX } from '@/constants';
import { ResultPage, ResultPageProps } from '@/views';
import { RenderView, RenderViewResult } from '../render_view/render_view.decorator';

@ApiTags('Result Page')
@Controller('result-page')
export class ResultPageController {
  @RenderView()
  @Get()
  async index(
    @Query()
    query: {
      status?: ResultPageProps['status'];
      title?: string;
      description?: string;
      type?: ResultPageProps['type'];
    }
  ) {
    const { status, title, description, type } = query;
    return new RenderViewResult({
      title: title || '结果',
      layout: 'base',
      scripts: [`${FE_PREFIX}/result_page.js`],
      styles: [`${FE_PREFIX}/result_page.css`],
      render() {
        return (
          <ResultPage
            status={status}
            title={title}
            description={description}
            type={type}
          />
        );
      },
    });
  }
}
