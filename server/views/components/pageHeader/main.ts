import cookiejs from 'cookiejs';

// 顶部搜索，#headerSearchInput，#headerSearchBtn
const headerSearchInput = document.querySelector('#headerSearchInput') as HTMLInputElement;
const headerSearchBtn = document.querySelector('#headerSearchBtn') as HTMLButtonElement;
document.addEventListener('DOMContentLoaded', () => {
  const searchParams = new URLSearchParams(window.location.search);
  const keyword = searchParams.get('keyword');
  if (keyword) {
    headerSearchInput.value = keyword;
  }
  headerSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      headerSearchBtn.click();
    }
  });
  headerSearchBtn.addEventListener('click', () => {
    const query = headerSearchInput.value.trim();
    if (query) {
      window.location.href = `/product-center?keyword=${encodeURIComponent(query)}`;
    } else {
      window.location.href = '/product-center';
    }
  });
});

document.querySelectorAll('.lang-item').forEach((el) => {
  el.addEventListener('click', () => {
    const lang = el.getAttribute('data-lang') as string;
    cookiejs.set('lang', lang);
    window.location.reload();
  });
});

/* 移动端 */

const headerNavItems = document.querySelectorAll('.phone-menu-container .nav-item');
headerNavItems.forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

document.querySelector('.phone-header .menu-item')?.addEventListener('click', () => {
  document.querySelector('.phone-menu-container')?.classList.toggle('show');
});
document.querySelector('.phone-menu-container')?.addEventListener('click', () => {
  document.querySelector('.phone-menu-container')?.classList.toggle('show');
});
document.querySelector('.phone-menu-container .phone-menu')?.addEventListener('click', (e) => {
  e.stopPropagation();
});

// 退出登录
document.querySelectorAll('.logout-btn').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/logout?redirect_uri=' + encodeURIComponent(window.location.href);
  });
});

// 登录块
document.querySelectorAll('.login-item').forEach((el) => {
  const cname = cookiejs.get('user_cname') as string;
  if (cname) {
    el.querySelector<HTMLDivElement>('.user-cname')!.textContent = cname;
    el.querySelector<HTMLDivElement>('.login-btn')!.style.display = 'none';
    el.querySelector<HTMLDivElement>('.logout-btn')!.style.display = 'inline-block';
  } else {
    el.querySelector<HTMLDivElement>('.user-cname')!.style.display = 'none';
    el.querySelector<HTMLDivElement>('.login-btn')!.style.display = 'inline-block';
    el.querySelector<HTMLDivElement>('.logout-btn')!.style.display = 'none';
  }
});
