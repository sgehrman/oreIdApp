import React from 'react';
import Captcha from '../js/captcha';

class CaptchaComponent extends React.Component {
  constructor(props) {
    super(props);

    const { action } = props;

    if (action) {
      Captcha.call(action);
    } else {
      console.log('CaptchaComponent needs an action.');
    }
  }

  render() {
    return null;
  }
}

export default CaptchaComponent;
