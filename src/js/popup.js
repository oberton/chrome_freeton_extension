import 'stylesheets/main.scss';
import App from 'js/components/App.svelte';
import "./components/index";
import "./directives/index";
import { init as initTranslate } from 'js/translate.js';

async function runApp() {
  const target = document.getElementById('app');

  const { currentServer } = await utils.storage.get('currentServer');

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
      utils,
    });
  }
}

async function startApp() {
  const locale = 'en';
  const response = await fetch(`/locales/${locale}.json`);
  const localeHash = await response.json();
  initTranslate(localeHash);
  if (NODE_ENV !== 'production') {
    window.localeHash = localeHash;
  }
  await runApp();
}

document.addEventListener('DOMContentLoaded', startApp);
