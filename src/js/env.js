import dotenv from 'dotenv';
import { useLocalStore } from 'mobx-react-lite';

dotenv.config();

const {
  REACT_APP_AUTH_CALLBACK: authCallbackUrl, // The url called by the server when login flow is finished - must match one of the callback strings listed in the App Registration
  REACT_APP_SIGN_CALLBACK: signCallbackUrl, // The url called by the server when transaction signing flow is finished - must match one of the callback strings listed in the App Registration

  REACT_APP_OREID_APP_ID: appId, // Provided when you register your app
  REACT_APP_OREID_API_KEY: apiKey, // Provided when you register your app
  REACT_APP_OREID_URL: oreIdUrl, // HTTPS Address of OREID server
  REACT_APP_BACKGROUND_COLOR: backgroundColor, // Background color shown during login flow
  REACT_APP_CHAIN_NETWORK: chainNetwork,

  REACT_APP_OREID_APP_ID_PROD: prodAppId, // Provided when you register your app
  REACT_APP_OREID_API_KEY_PROD: prodApiKey, // Provided when you register your app
  REACT_APP_OREID_URL_PROD: prodOreIdUrl, // HTTPS Address of OREID server
  REACT_APP_BACKGROUND_COLOR_PROD: prodBackgroundColor, // Background color shown during login flow
  REACT_APP_CHAIN_NETWORK_PROD: prodChainNetwork,
} = process.env;

class ENV {
  constructor() {
    this.model = {
      authCallbackUrl,
      signCallbackUrl,
      appId,
      apiKey,
      oreIdUrl,
      backgroundColor,
      chainNetwork,
    };

    this.modelProd = {
      authCallbackUrl,
      signCallbackUrl,
      appId: prodAppId,
      apiKey: prodApiKey,
      oreIdUrl: prodOreIdUrl,
      backgroundColor: prodBackgroundColor,
      chainNetwork: prodChainNetwork,
    };

    this.loadFromLocalStorage(true);
    this.loadFromLocalStorage(false);
  }

  getModel(prod) {
    if (prod) {
      return this.modelProd;
    }

    return this.model;
  }

  saveToLocalStorage(setting, prod) {
    if (prod) {
      localStorage.setItem('settings-prod', setting);
    } else {
      localStorage.setItem('settings', setting);
    }
  }

  loadFromLocalStorage(prod) {
    let settings;
    let m;

    if (prod) {
      m = this.modelProd;
      settings = localStorage.getItem('settings-prod');
    } else {
      m = this.model;
      settings = localStorage.getItem('settings');
    }

    // merge localstorage values
    if (settings && settings.length) {
      const obj = JSON.parse(settings);

      const valid = (str) => {
        return str && str.length > 0;
      };

      m.appId = valid(obj.appId) ? obj.appId : m.appId;
      m.apiKey = valid(obj.apiKey) ? obj.apiKey : m.apiKey;
      m.oreIdUrl = valid(obj.oreIdUrl) ? obj.oreIdUrl : m.oreIdUrl;
      m.backgroundColor = valid(obj.backgroundColor) ? obj.backgroundColor : m.backgroundColor;
      m.chainNetwork = valid(obj.chainNetwork) ? obj.chainNetwork : m.chainNetwork;
    }
  }
}

export default ENV;
