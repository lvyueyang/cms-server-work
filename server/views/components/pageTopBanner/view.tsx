import { useSSRContext } from '../../hooks';
import { Breadcrumb } from '../breadcrumb/view';

interface PageTopBannerProps {
  breadcrumbName: string;
  title: string;
  desc: string;
  bg: string;
  bgType?: 'image' | 'video';
}

export function PageTopBanner({
  breadcrumbName,
  title,
  desc,
  bg,
  bgType = 'image',
}: PageTopBannerProps) {
  const { t } = useSSRContext();
  return (
    <div className="page-top-banner">
      <div className="bg">
        {bgType === 'image' ? <img src={bg} alt={title} /> : <video src={bg} autoPlay loop muted />}
      </div>
      <div className="wp">
        <Breadcrumb
          className="white"
          items={[{ label: t('首页'), href: '/' }, { label: breadcrumbName }]}
        />

        <div className="banner-content">
          <h1 className="banner-title">{title}</h1>
          <p className="banner-desc">{desc}</p>
        </div>
      </div>
    </div>
  );
}
