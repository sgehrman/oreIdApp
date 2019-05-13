import dotenv from 'dotenv';

dotenv.config();

const {
  REACT_APP_OREID_APP_ID: appId, // Provided when you register your app
  REACT_APP_OREID_API_KEY: apiKey, // Provided when you register your app
  REACT_APP_AUTH_CALLBACK: authCallbackUrl, // The url called by the server when login flow is finished - must match one of the callback strings listed in the App Registration
  REACT_APP_SIGN_CALLBACK: signCallbackUrl, // The url called by the server when transaction signing flow is finished - must match one of the callback strings listed in the App Registration
  REACT_APP_OREID_URL: oreIdUrl, // HTTPS Address of OREID server
  REACT_APP_BACKGROUND_COLOR: backgroundColor, // Background color shown during login flow
  REACT_APP_CHAIN_NETWORK: chainNetwork,
} = process.env;

class ENV {
  constructor() {
    this.appId = appId;
    this.apiKey = apiKey;
    this.authCallbackUrl = authCallbackUrl;
    this.signCallbackUrl = signCallbackUrl;
    this.oreIdUrl = oreIdUrl;
    this.backgroundColor = backgroundColor;
    this.chainNetwork = chainNetwork;

    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const settings = localStorage.getItem('settings');

    if (settings && settings.length) {
      const obj = JSON.parse(settings);

      const valid = (str) => {
        return str && str.length > 0;
      };

      this.appId = valid(obj.appId) ? obj.appId : this.appId;
      this.apiKey = valid(obj.apiKey) ? obj.apiKey : this.apiKey;
      this.oreIdUrl = valid(obj.oreIdUrl) ? obj.oreIdUrl : this.oreIdUrl;
      this.backgroundColor = valid(obj.backgroundColor) ? obj.backgroundColor : this.backgroundColor;
      this.chainNetwork = valid(obj.chainNetwork) ? obj.chainNetwork : this.chainNetwork;
    }
  }
}

const instance = new ENV();

export default instance;
