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
};

conf.telegramLink = 'https://t.me/freeoberton';

conf.fallbackLocale = 'en';
conf.showDevTool = false;
conf.devAutopin = '222222';

conf.ignoreExceptions = true; // ignore http errors, just in case

export default conf;
