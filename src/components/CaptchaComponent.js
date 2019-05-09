import React from 'react';
import Captcha from '../js/captcha';

class CaptchaComponent extends React.Component {
  constructor(props) {
    super(props);

    const { action, callback } = props;

    // TODO get app key from ENV
    const captcha = new Captcha('6LeiiaIUAAAAAJpDi_k8vyd4FTZG6KOcvYoEIERZ');

    const captchaCallback = (token) => {
      console.log(token);

      if (callback) {
        callback(token);
      }
    };

    if (action) {
      captcha.call(action, captchaCallback);
    } else {
      console.log('CaptchaComponent needs an action.');
    }
  }

  render() {
    return null;
  }
}

export default CaptchaComponent;
