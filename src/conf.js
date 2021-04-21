const conf = {};

conf.tonServers = ['main.ton.dev', 'net.ton.dev', 'fld.ton.dev'];
conf.contracts = ['SafeMultisigWallet', 'SetcodeMultisigWallet']

conf.supportedLocales = {
  ru: 'Русский',
  el: 'English',
};

conf.fallbackLocale = 'en';

export default conf;
