import exception from 'js/utils/utils/exception';
import getWalletData from './getWalletData';
import getWalletByKeys from './getWalletByKeys';

async function getWallet(wallet) {
  let err, walletData;
  const contract = wallet.contract || conf.contracts[0].file;

  if (wallet.phrase) {

    [err, walletData] = await to(getWalletData(wallet.phrase, false, {}, contract));

    if (err) {
      exception(err);
      return null;
    }

  } else if (wallet.public && wallet.secret) {
    [err, walletData] = await to(getWalletByKeys(wallet, contract));

    if (err) {
      exception(err);
      return null;
    }
  }

  const address = _.get(walletData, 'wallet.address');

  return {...walletData, contract, address };
}

async function getAllWallets() {
  const allWallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);
  const wallets = _(allWallets).filter(w => w.network === conf.currentTonServer).value();

  const walletsData = await Promise.all(_.map(wallets, getWallet));

  return walletsData;

}

export default getAllWallets;
