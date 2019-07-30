import { OreId } from 'eos-auth';
import scatterProvider from 'eos-transit-scatter-provider';
import ledgerProvider from 'eos-transit-ledger-provider';
import lynxProvider from 'eos-transit-lynx-provider';
import meetoneProvider from 'eos-transit-meetone-provider';
import tokenpocketProvider from 'eos-transit-tokenpocket-provider';
import keycatProvider from 'eos-transit-keycat-provider';
import portisProvider from 'eos-transit-portis-provider';
import simpleosProvider from 'eos-transit-simpleos-provider';
import whalevaultProvider from 'eos-transit-whalevault-provider';
import { Ledger } from 'ual-ledger';
import { Scatter } from 'ual-scatter';
import { Lynx } from 'ual-lynx';
import { TokenPocket } from 'ual-token-pocket';

import ENV from './env';

export default class ORE {
  constructor(model) {
    this.v_busyFlag = false;
    this.v_waitingForLocalStateLogin = false;
    this.v_model = model;
    this.v_env = new ENV();

    this.createOREId();
  }

  env() {
    return this.v_env.getModel(this.v_model.prod);
  }

  reload() {
    this.v_env.loadFromLocalStorage(this.v_model.prod);
    this.createOREId();
  }

  restoreDefaults() {
    this.v_env.restoreDefaults(this.v_model.prod);
    this.createOREId();
  }

  saveSettings(settings) {
    this.v_env.saveToLocalStorage(settings, this.v_model.prod);
  }

  createOREId() {
    const eosTransitWalletProviders = [
      scatterProvider(),
      ledgerProvider({ exchangeTimeout: 30000 }),
      lynxProvider(),
      meetoneProvider(),
      tokenpocketProvider(),
      keycatProvider(),
      portisProvider(),
      simpleosProvider(),
      whalevaultProvider()
    ];

    const ualProviders = [
      // Ledger,
      // Scatter,
      // TokenPocket,
      // Lynx
    ];

    const setBusyCallback = (isBusy) => {
      console.log('busy: ', isBusy);
      this.v_busyFlag = isBusy;
    };

    this.v_oreid = new OreId({
      appName: 'ORE ID Sample App',
      appId: this.env().appId,
      apiKey: this.env().apiKey,
      oreIdUrl: this.env().oreIdUrl,
      authCallbackUrl: this.env().authCallbackUrl,
      signCallbackUrl: this.env().signCallbackUrl,
      backgroundColor: this.env().backgroundColor,
      setBusyCallback,
      eosTransitWalletProviders,
      ualProviders
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

    await this.getUser();

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
        this.getUser(account);
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
        this.displayResults(signedTransaction, 'Signed transaction');
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

  // if you don't pass the account, it gets the cached values
  async getUser(account = null) {
    this.displayResults();

    try {
      const info = await this.v_oreid.getUser(account);
      this.setUserInfo(info);
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
