import { createI18n } from 'vue-i18n';
import lv from './lv';

export const i18n = createI18n({
  legacy: false,
  locale: 'lv',
  fallbackLocale: 'lv',
  messages: {
    lv,
  },
});
