import { PublicArticle } from '@/modules/public_article/public_article.entity';
import { PageTopBanner } from '@/views/components/pageTopBanner/view';

interface PublicArticleDetailPageProps {
  info: PublicArticle;
}
export function PublicArticleDetailPage({ info }: PublicArticleDetailPageProps) {
  return (
    <>
      <PageTopBanner
        breadcrumbName={info.title}
        title={info.title}
        bg={info.cover}
        desc={info.desc || ''}
      />
      <div className="wp article-detail-page">
        <h1 className="article-title">{info.title}</h1>
        <hr />
        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: info.content }}
        ></div>
      </div>
    </>
  );
}
