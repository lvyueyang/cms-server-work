import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Initialize Home Banner Swiper
new Swiper('#homeBanner', {
  modules: [Navigation, Pagination, Autoplay],
  loop: true,
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
