const conf = {};

conf.tonServers = ['main.ton.dev', 'net.ton.dev'];
conf.contracts = [{
  name: 'Surf',
  file: 'SetcodeMultisigWallet',
}, {
  name: 'Safe Multisig',
  file:'SafeMultisigWallet',
}];

conf.supportedLocales = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
};

conf.telegramLink = 'https://t.me/freeoberton';

conf.fallbackLocale = 'en';
// conf.showDevTool = false;
conf.showDevTool = false;
// conf.devAutopin = '222222';

conf.ignoreExceptions = false; // ignore http errors, just in case

conf.initialStickers = [{
  id: '1',
  text: 'Surf',
  color: '#2196f3',
}, {
  id: '2',
  text: 'Multisig',
  color: '#b344fd',
}, {
  id: '3',
  text: 'Default',
  color: '#3c8c24',
}];

export default conf;
