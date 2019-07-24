import React from 'react';

function BuyCarbon(props) {
  function load() {
    return new Promise((resolve, reject) => {
      const scriptId = 'carbon-money';
      const sourceUrl = 'https://carbon12.s3.amazonaws.com/carbonFiber.js';

      const [head] = document.getElementsByTagName('head');
      const js = document.createElement('script');

      js.id = scriptId;
      js.src = sourceUrl;

      js.onload = () => {
        if (!window) {
          reject(new Error('Google recaptcha is not available'));
        }

        resolve('success');
      };

      head.appendChild(js);
    });
  }

  if (!window.CarbonWidget) {
    load().then((result) => {
      console.log(result);

      window.CarbonWidget.default.carbonFiber.render({
        clientName: 'Carbon Fiber',
        // options are sandbox or production
        environment: 'sandbox',
        // tokens: "eth",
        // currencies: "usd",
        // homeScreenMessage: "Buy and Sell Any Crypto",
        // defaults can specify externally if you authenticate addresses
        // elsewhere say as a wallet
        receiveAddress: {
          eth: '',
          eos: '',
          trx: '',
          btt: '',
          btc: '',
          bnb: ''
        },
        apiKey: '', // update!
        // optional comma-delimited (no spaces) list of tokens to support
        // defaults to all
        // tokens: 'eth,eos,trx,btc,btt',
        targetContainerId: 'carbonfiber'
      });
    });
  }

  return (
    <div
      className="carbonfiber"
      id="carbonfiber"
    />
  );
}

export default BuyCarbon;
