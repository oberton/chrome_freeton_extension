const conf = {};

conf.tonServers = ['main.ton.dev', 'net.ton.dev'];
conf.contracts = [{
  name: 'Safe Multisig',
  file:'SafeMultisigWallet',
}, {
  name: 'Surf',
  file: 'SetcodeMultisigWallet',
}];

conf.supportedLocales = {
  ru: 'Русский',
  en: 'English',
};

conf.fallbackLocale = 'en';

export default conf;
