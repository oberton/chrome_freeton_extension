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

conf.fallbackLocale = 'en';

export default conf;
