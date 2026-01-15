import i18n from 'i18next';
import { ContentLang } from '../../../src/constants';

i18n.init({
  lng: window.lang,
  debug: false,
  resources: {
    [ContentLang.EN_US]: {
      translation: window.locals[ContentLang.EN_US],
    },
  },
});
