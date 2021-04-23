import { init as initTranslate } from 'js/translate';
import storage from './storage';

async function changeLocale(locale, save = false) {
  conf.currentLocale = locale;
  const response = await fetch(`/locales/${locale}.json`);
  const localeHash = await response.json();
  initTranslate(localeHash);
  if (NODE_ENV !== 'production') {
    window.localeHash = localeHash;
  }
  if (save) {
    await storage.set({locale});
  }
}

export default changeLocale;
