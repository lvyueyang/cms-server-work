import { NewsController } from './news.controller';

type PageData = Awaited<ReturnType<NewsController['detail']>>;
