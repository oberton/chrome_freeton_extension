import 'stylesheets/main.scss';
import App from 'js/components/App.svelte';
import "./components/index";
import "./directives/index";
import { init as initTranslate } from 'js/translate';

async function runApp() {
  const target = document.getElementById('app');

  let { currentServer } = await utils.storage.get('currentServer');

  if (!currentServer) {
    currentServer = conf.tonServers[0];
  }

  if (currentServer && _.includes(conf.tonServers, currentServer)) {
    conf.currentTonServer = currentServer;
    conf.tonClient = tonMethods.getClient();
  }

  const app = new App({
    target,
  });

  if (NODE_ENV !== 'production') {
    _.assign(window, {
      t,
      svelte,
      tonMethods,
      app,
      conf,
      to,
      utils,
    });
  }
}

async function detectLocale() {
  const prevLocale = await utils.storage.get('locale')
  const browserLocaleRaw = _.get(prevLocale, 'locale') || (navigator.language || conf.fallbackLocale).toLowerCase();
  const browserLocale = browserLocaleRaw.split('-')[0];
  if (conf.supportedLocales[browserLocale]) {
    return browserLocale;
  }
  return conf.fallbackLocale;
}

async function startApp() {
  const locale = await detectLocale();
  conf.currentLocale = locale;
  const response = await fetch(`/locales/${locale}.json`);
  const localeHash = await response.json();
  initTranslate(localeHash);
  if (NODE_ENV !== 'production') {
    window.localeHash = localeHash;
  }
  await runApp();
}

document.addEventListener('DOMContentLoaded', startApp);
