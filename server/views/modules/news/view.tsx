import dayjs from 'dayjs';
import { NewsInfo } from '@/modules/news/news.dto';
import { PageTopBanner } from '@/views/components/pageTopBanner/view';
import { useSSRContext } from '@/views/hooks';

interface NewsPageProps {
  dataList: NewsInfo[];
  prev: number;
  next: number;
}

export function NewsPage({ dataList, prev, next }: NewsPageProps) {
  const { t } = useSSRContext();
  return (
    <>
      <PageTopBanner
        breadcrumbName={t('企业动态')}
        title={t('新闻资讯')}
        desc={t('xxxxxxx')}
        bg="/imgs/banner-6.png"
      />
      <div className="wp news-page-list">
        {dataList.map((item) => {
          const date = dayjs(item.push_date || item.create_date).format('YYYY / MM / DD');
          return (
            <a
              href={`/news/${item.id}`}
              key={item.id}
              className="item"
            >
              <img
                src={item.cover}
                alt=""
                className="cover"
              />
              <div className="title">{item.title}</div>
              <div>
                <div className="more">
                  {t('了解更多')}
                  {'>>'}
                </div>
                <div className="date">{date}</div>
              </div>
            </a>
          );
        })}
      </div>
      <div>
        {!!prev && <a href={`/news?current=${prev}`}>{t('上一页')}</a>}
        {!!next && <a href={`/news?current=${next}`}>{t('下一页')}</a>}
      </div>
    </>
  );
}
