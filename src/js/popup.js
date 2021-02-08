import 'stylesheets/main.scss';
import App from 'js/components/App.svelte';

async function startApp() {
  const target = document.getElementById('app');

  const { currentServer } = await utils.storage.get('currentServer');

  if (currentServer && _.includes(conf.tonServers, currentServer)) {
    conf.currentTonServer = currentServer;
  }

  const app = new App({
    target,
  });

  if (NODE_ENV !== 'production') {
    _.assign(window, {
      tonClient,
      tonMethods,
      app,
      conf,
      utils,
    });
  }
}

document.addEventListener('DOMContentLoaded', startApp);
