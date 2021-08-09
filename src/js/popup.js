import 'stylesheets/main.scss';
import App from 'js/components/App.svelte';
import "./components/index";
import "./directives/index";
import port from 'js/utils/port';

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
  const prevLocale = await utils.storage.get('locale');
  const browserLocaleRaw = _.get(prevLocale, 'locale') || (window.navigator.language || conf.fallbackLocale).toLowerCase();
  const browserLocale = browserLocaleRaw.split('-')[0];
  if (conf.supportedLocales[browserLocale]) {
    return browserLocale;
  }
  return conf.fallbackLocale;
}

utils.eventBus.setPort(port);

port.onMessage.addListener((msg) => {
  if (msg.type === 'eventBus') {
    utils.eventBus.notify(msg.eventName, msg.value, port);
  }
});

async function startApp() {
  const locale = await detectLocale();
  conf.$port = port;
  await utils.changeLocale(locale);
  await runApp();
}

document.addEventListener('DOMContentLoaded', startApp);
