import dayjs from 'dayjs';
import { Banner } from '@/modules/banner/banner.entity';
import { News } from '@/modules/news/news.entity';
import { VideoPlayer } from '@/views/components/videoPlayer/view';
import { useSSRContext } from '@/views/hooks';

interface HomePageProps {
  banners: Banner[];
  news?: News;
}
export function HomePage(props: HomePageProps) {
  const { t } = useSSRContext();

  return (
    <>
      {/* Banner Section */}
      <div
        className="swiper banner"
        id="homeBanner"
      >
        <div className="swiper-wrapper">
          {props.banners?.map((banner) => {
            return (
              <div
                className="swiper-slide"
                key={banner.id}
              >
                <div className="image-content">
                  <img
                    src={banner.cover}
                    alt={banner.title}
                  />
                </div>
                <div className="banner-content wp">
                  <div className="text-content">
                    <h2 className="title">{banner.title}</h2>
                    <p
                      className="desc"
                      dangerouslySetInnerHTML={{ __html: banner.content || '' }}
                    ></p>
                    {!!banner.url && (
                      <a
                        href={banner.url}
                        className="btn btn-outline"
                      >
                        {t('了解详情')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>

      {/* Company News Section */}
      <div className="section-news wp">
        <div className="news-content">
          <div className="news-date">
            {dayjs(props.news?.push_date || props.news?.create_date).format('YYYY-MM-DD')} |{t('企业动态')}
          </div>
          <h2 className="news-title">{props.news?.title}</h2>
          <div className="news-divider"></div>
          <a
            href={`/news/${props.news?.id}`}
            className="btn"
          >
            {t('阅读详情')}
          </a>
        </div>
        <img
          className="news-image"
          src={props.news?.cover}
          alt={props.news?.title}
        />
      </div>
    </>
  );
}
