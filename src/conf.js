const conf = {};

conf.tonServerKeys = ['main.ton.dev', 'net.ton.dev'];

conf.tonServers = {
  "main.ton.dev": {
    name: 'Main Net',
    endpoints: ["https://main2.ton.dev", "https://main3.ton.dev", "https://main4.ton.dev"],
    color: '#0083e0',
  },
  "net.ton.dev": {
    name: 'Test Net',
    endpoints: ["https://net1.ton.dev", "https://net5.ton.dev"],
    color: '#da8302',
  },
};

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
conf.devAutopin = '222222';

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

conf.uiColors = [
  "#fc5c65",
  "#fd9644",
  "#00a953",
  "#2b9ecb",
  "#eb3b5a",
  "#fa8231",
  "#f7b731",
  "#20bf6b",
  "#45aaf2",
  "#4b7bec",
  "#a55eea",
  "#778ca3",
  "#2d98da",
  "#3867d6",
  "#8854d0",
  "#4b6584",
];

export default conf;
