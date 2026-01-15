import { ContentLang } from '@/constants';
import { RenderViewResult } from '@/modules/render_view/render_view.decorator';
import { GlobalData } from '@/modules/render_view/render_view.service';

export type SSRProps<T = {}> = {
  /** 当前语言 */
  lang: ContentLang;
  /** 国际化方法 */
  t: RenderViewResult['t'];
  /** 全局数据 */
  globalData: GlobalData;
  /** 上下文 */
  context: {
    getRequest: RenderViewResult['getRequest'];
    getResponse: RenderViewResult['getResponse'];
  };
} & T;
