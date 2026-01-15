import { Chinese, Down, English, HamburgerButton, Search } from '@icon-park/react';
import { ContentLang } from '@/constants';
import { useSSRContext } from '../../hooks';

interface MenuItem {
  title: string;
  url: string;
  isFullMenu?: boolean;
  children?: { title: string; url: string; children?: { title: string; url: string }[] }[];
}

export function Header() {
  const { t, globalData } = useSSRContext();
  const menuList: MenuItem[] = [
    {
      title: t('首页'),
      url: '/',
    },
    {
      title: t('多级分类菜单'),
      url: '/product-center',
      isFullMenu: true,
      children: [
        {
          title: t('类型一'),
          url: '/',
          children: [
            {
              title: t('产品1'),
              url: '/',
            },
          ],
        },
      ],
    },
    {
      title: t('多级菜单'),
      url: '/',
      children: [
        {
          title: t('菜单1'),
          url: '/',
        },
        {
          title: t('菜单2'),
          url: '/',
        },
        {
          title: t('菜单3'),
          url: '/',
        },
      ],
    },
    {
      title: t('新闻'),
      url: '/news',
    },
  ] as const;
  return (
    <>
      <header className="header">
        <div className="header-main wp">
          <div className="header-logo">
            <a href="/">
              <img
                src="/imgs/logo.png"
                alt=""
              />
            </a>
          </div>
          <div className="header-search">
            <input
              type="text"
              placeholder={t('搜索')}
            />
            <button
              type="button"
              className="search-btn"
            >
              <Search />
            </button>
          </div>
          <div className="header-contact">
            <div className="contact-icon">
              <img
                src="/imgs/icon-tell.svg"
                alt=""
              />
            </div>
            <div className="contact-details">
              <a
                className="contact-email"
                href={`mailto:${globalData.company_email}`}
              >
                {globalData.company_email}
              </a>
              <a
                className="contact-phone"
                href={`tel:${globalData.company_tell}`}
              >
                {globalData.company_tell}
              </a>
            </div>
          </div>
        </div>
        <nav className="header-nav">
          <div className="nav-container wp">
            <ul className="nav-list">
              {menuList.map((item) => (
                <li
                  className={`nav-item${item.isFullMenu ? ' full-width-menu' : ''}${
                    item.children?.length ? ' has-submenu' : ''
                  }`}
                  key={item.url}
                >
                  <a href={item.url}>
                    {item.title}
                    {!!item.children?.length && <span className="arrow"></span>}
                  </a>
                  {!!item.children?.length &&
                    (item.isFullMenu ? (
                      <div className="submenu-full">
                        <div className="submenu-container">
                          {item.children?.map((group) => {
                            return (
                              <div
                                className="submenu-column"
                                key={group.title}
                              >
                                <a
                                  className="column-title"
                                  href={group.url}
                                >
                                  {group.title} <span className="arrow-right">→</span>
                                </a>
                                <ul className="column-list">
                                  {group.children?.map((item) => {
                                    return (
                                      <li key={item.url}>
                                        <a href={item.url}>{item.title}</a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <ul className="submenu">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <a href={child.url}>{child.title}</a>
                          </li>
                        ))}
                      </ul>
                    ))}
                </li>
              ))}
            </ul>
            <div className="header-operate">
              <HeaderOperate />
            </div>
          </div>
        </nav>
      </header>
      <header className="phone-header">
        <div className="header-logo">
          <a href="/">
            <img
              src="/imgs/logo-2.webp"
              alt=""
            />
          </a>
        </div>
        <div className="header-operate">
          <HeaderOperate />
          <div className="item menu-item">
            <HamburgerButton
              theme="outline"
              size={30}
              strokeWidth={2}
            />
          </div>
        </div>
      </header>
      <div className="phone-menu-container">
        <div className="phone-menu">
          <ul className="nav-list">
            {menuList.map((item) => (
              <li
                className={`nav-item ${item.isFullMenu ? 'full-width-menu' : ''} ${
                  item.children?.length ? 'has-submenu' : ''
                }`}
                key={item.url}
              >
                <div className="nav-item-link">
                  <a href={item.url}>{item.title}</a>
                  {!!item.children?.length && (
                    <span className="arrow">
                      <Down />
                    </span>
                  )}
                </div>
                {!!item.children?.length &&
                  (item.isFullMenu ? (
                    <div className="submenu-full">
                      <div className="submenu-container">
                        {item.children?.map((group) => {
                          return (
                            <div
                              className="submenu-column"
                              key={group.title}
                            >
                              <a
                                className="column-title"
                                href={group.url}
                              >
                                {group.title} <span className="arrow-right">→</span>
                              </a>
                              <ul className="column-list">
                                {group.children?.map((item) => {
                                  return (
                                    <li key={item.url}>
                                      <a href={item.url}>{item.title}</a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <ul className="submenu">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <a href={child.url}>{child.title}</a>
                        </li>
                      ))}
                    </ul>
                  ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function HeaderOperate() {
  const { t, lang, context, globalData } = useSSRContext();
  return (
    <>
      {globalData.i18n_enabled && (
        <>
          {lang === ContentLang.ZH_CN && (
            <a
              href="#"
              className="item lang-item"
              data-lang={ContentLang.EN_US}
              title={t('切换到英文')}
            >
              <English
                theme="outline"
                size={30}
                strokeWidth={2}
              />
            </a>
          )}
          {lang === ContentLang.EN_US && (
            <a
              href="#"
              className="item lang-item"
              data-lang={ContentLang.ZH_CN}
              title={t('切换到中文')}
            >
              <Chinese
                theme="outline"
                size={30}
                strokeWidth={2}
              />
            </a>
          )}
        </>
      )}
      <div className="login-item item">
        <span className="user-cname"></span>
        <a
          className="login-btn"
          style={{ display: 'none' }}
          href={`/login?redirect_uri=${encodeURIComponent(context.getRequest().url)}`}
        >
          {t('登录')}
        </a>
        <a
          className="logout-btn"
          href="#"
          style={{ display: 'none' }}
        >
          {t('退出')}
        </a>
      </div>
    </>
  );
}
