import React from 'react';
export default function Header() {
  return (
    <header className="header">
      <div className="header-logo-link wp">
        <a className="header-logo" href="/" title="">
          <img src="/imgs/logo.png" />
        </a>
        <div className="operate">
          <a href="" className="login-btn">
            登录
          </a>
        </div>
      </div>
      <div className="header-menu wp" id="headerMenu">
        <dl>
          <dt className="arrow">菜单1</dt>
          <dd>
            <div className="header-menu-child-item">
              <div className="title">
                <a href="">菜单1-1</a>
              </div>
              <a href="">111111</a>
              <a href="">22222</a>
              <a href="">333333</a>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>
            <a href="/news">新闻动态</a>
          </dt>
        </dl>
        <dl>
          <dt>
            <a href="/about">关于我们</a>
          </dt>
        </dl>
      </div>
    </header>
  );
}
