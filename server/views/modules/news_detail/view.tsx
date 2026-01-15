import { NewsInfo } from '@/modules/news/news.dto';
import { useSSRContext } from '@/views/hooks';

interface NewsDetailPageProps {
  info: NewsInfo;
  next?: {
    title: string;
    id: number;
  };
  prev?: {
    title: string;
    id: number;
  };
}
export function NewsDetailPage({ info }: NewsDetailPageProps) {
  return (
    <div className="wp news-detail-page">
      <h1 className="news-title">{info.title}</h1>
      {/* <div>{info.desc}</div> */}
      {/* <div>{dayjs(info?.push_date || info.create_date).format('YYYY-MM-DD HH:mm:ss')}</div> */}
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: info.content }}
      ></div>
      {/* <hr /> */}
      {/* <div>
        {!!prev && (
          <div>
            <a href={`/news/${prev?.id}`}>
              {t('上一篇')}:{prev?.title}
            </a>
          </div>
        )}
        {!!next && (
          <div>
            <a href={`/news/${next?.id}`}>
              {t('下一篇')}:{next?.title}
            </a>
          </div>
        )}
      </div> */}
    </div>
  );
}
