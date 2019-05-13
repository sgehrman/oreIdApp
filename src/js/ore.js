import { OreId } from 'eos-auth';
import scatterProvider from 'eos-transit-scatter-provider';
import ledgerProvider from 'eos-transit-ledger-provider';
import lynxProvider from 'eos-transit-lynx-provider';
import meetoneProvider from 'eos-transit-meetone-provider';
import tokenpocketProvider from 'eos-transit-tokenpocket-provider';
import ENV from './env';

export default class ORE {
  constructor(model) {
    this.v_busyFlag = false;
    this.v_waitingForLocalStateLogin = false;
    this.v_model = model;

    this.createOREId();
  }

  reload() {
    ENV.loadFromLocalStorage();
    this.createOREId();
  }

  createOREId() {
    const eosTransitWalletProviders = [scatterProvider(), ledgerProvider({ pathIndexList: [0, 1, 2, 35] }), lynxProvider(), meetoneProvider(), tokenpocketProvider()];

    const setBusyCallback = (isBusy) => {
      console.log('busy: ', isBusy);
      this.v_busyFlag = isBusy;
    };

    this.v_oreid = new OreId({
      appName: 'ORE ID Sample App',
      appId: ENV.appId,
      apiKey: ENV.apiKey,
      oreIdUrl: ENV.oreIdUrl,
      authCallbackUrl: ENV.authCallbackUrl,
      signCallbackUrl: ENV.signCallbackUrl,
      backgroundColor: ENV.backgroundColor,
      setBusyCallback,
      eosTransitWalletProviders,
    });
  }

  isBusy() {
    return this.v_busyFlag;
  }

  // pass nothing to clear and set loggedIn state to false
  setUserInfo(info = null) {
    if (info) {
      this.v_model.isLoggedIn = true;
      this.v_model.userInfo = info;
    } else {
      this.v_model.isLoggedIn = false;
      this.v_model.userInfo = {};
    }
  }

  // called on page load to get the user info from ORE ID
  async loadUserFromLocalState() {
    this.v_waitingForLocalStateLogin = true;

    const info = await this.v_oreid.getUser();

    if (info && info.accountName) {
      this.setUserInfo(info);
    }

    this.v_waitingForLocalStateLogin = false;
  }

  waitingForLogin() {
    return this.v_waitingForLocalStateLogin;
  }

  canDiscover(provider) {
    return this.v_oreid.canDiscover(provider);
  }

  async discover(args) {
    return this.v_oreid.discover(args);
  }

  async sign(options) {
    return this.v_oreid.sign(options);
  }

  // Handle the authCallback coming back from ORE-ID with an "account" parameter indicating that a user has logged in
  async handleAuthCallback() {
    const url = window.location.href;
    if (/authcallback/i.test(url)) {
      const { account, errors } = await this.v_oreid.handleAuthResponse(url);
      if (!errors) {
        this.loadUserFromApi(account);
      } else {
        this.displayResults(errors, 'Error');
      }
    }
  }

  // Handle the signCallback coming back from ORE-ID with a "signedTransaction" parameter providing the transaction object with signatures attached
  async handleSignCallback() {
    const url = window.location.href;
    if (/signcallback/i.test(url)) {
      const { signedTransaction, state, errors } = await this.v_oreid.handleSignResponse(url);
      if (!errors && signedTransaction) {
        this.displayResults(signedTransaction, 'Returned signed transaction');
        this.v_model.signState = state;
      } else {
        this.displayResults(errors, 'Error');
      }
    }
  }

  displayResults(results, resultsTitle = null) {
    if (results) {
      this.v_model.results = JSON.stringify(results, null, '  ');
      this.v_model.resultsTitle = resultsTitle;
    } else {
      this.v_model.results = '';
    }
  }

  async login(args) {
    this.displayResults();

    try {
      const result = this.v_oreid.login(args);

      this.displayResults(result);

      return result;
    } catch (error) {
      this.displayResults(error, 'Error');

      return null;
    }
  }

  logout() {
    this.displayResults();

    this.setUserInfo();

    // clears local user state (stored in local storage or cookie)
    this.v_oreid.logout();
  }

  async loadUserFromApi(account) {
    this.displayResults();

    try {
      const info = await this.v_oreid.getUserInfoFromApi(account);
      this.setUserInfo(info);

      this.displayResults(info, 'User Info');
    } catch (error) {
      this.displayResults(error, 'Error');
    }
  }

  async passwordlessSendCode(args) {
    this.displayResults();

    const result = await this.v_oreid.passwordlessSendCodeApi(args);

    this.displayResults(result);

    return result;
  }

  async passwordlessVerifyCode(args) {
    this.displayResults();

    const result = await this.v_oreid.passwordlessVerifyCodeApi(args);

    this.displayResults(result);

    return result;
  }
}
