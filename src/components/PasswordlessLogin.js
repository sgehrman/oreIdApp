import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import ENV from '../js/env';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import PhoneNumber from 'awesome-phonenumber';

const modeEnum = {
  START: 'start',
  ASK_EMAIL: 'askEmail',
  ASK_PHONE: 'askPhone',
  VERIFY_EMAIL: 'verifyEmail',
  VERIFY_PHONE: 'verifyPhone',
};

const buttonMargin = {
  marginBottom: '6px',
};

function PasswordlessLogin(props) {
  // NOTE: we are using React hooks 'useState'. This is just like React's this.state in React component classes
  // See this link for more information: https://reactjs.org/docs/hooks-overview.html
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState(modeEnum.START);

  const { ore, model } = props;

  // Similar to componentDidMount
  useEffect(() => {
    ore.loadUserFromLocalState();
    ore.handleAuthCallback();
  }, []);

  function handleEmailOrPhoneChange(e) {
    const { value } = e.target;
    setEmailOrPhone(value);
  }

  function handleCodeChange(e) {
    const { value } = e.target;
    setCode(value);
  }

  async function loginWithCode(provider) {
    const args = { provider, code, chainNetwork: ENV.chainNetwork };
    switch (provider) {
      case 'phone':
        args.phone = encodeURIComponent(emailOrPhone); // incase of + sign
        break;
      case 'email':
        args.email = emailOrPhone;
        break;
      default:
        console.log('login switch not handled');
    }

    const loginResponse = await ore.login(args);
    if (loginResponse) {
      const { loginUrl } = loginResponse;
      // if the login responds with a loginUrl, then redirect the browser to it to start the user's OAuth login flow
      if (loginUrl) {
        window.location = loginUrl;
      } else {
        model.results = 'loginUrl was null';
      }
    }
  }

  function clickedLoginStyle(provider) {
    switch (provider) {
      case 'email':
        setMode(modeEnum.ASK_EMAIL);
        break;
      case 'phone':
        setMode(modeEnum.ASK_PHONE);
        break;
      default:
        console.log('login style switch failed');
        break;
    }
  }

  async function clickedRequestCode(provider) {
    const args = {
      provider,
    };

    switch (provider) {
      case 'phone':
        args.phone = encodeURIComponent(emailOrPhone); // incase of + sign
        break;
      case 'email':
        args.email = emailOrPhone;
        break;
      default:
        console.log('login switch not handled');
    }

    const result = await ore.passwordlessSendCode(args);

    if (result.success === true) {
      switch (provider) {
        case 'email':
          setMode(modeEnum.VERIFY_EMAIL);
          break;
        case 'phone':
          setMode(modeEnum.VERIFY_PHONE);
          break;
        default:
          console.log('login style switch failed');
          break;
      }
    }
  }

  // function doRenderBusy() {
  //   return <div>Busy...</div>;
  // }

  function doRenderStart() {
    return (
      <div className="groupClass">
        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedLoginStyle('email')} color="primary">
          Login with Email
        </Button>

        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedLoginStyle('phone')} color="primary">
          Login with Phone
        </Button>
      </div>
    );
  }

  function doRenderAsk(provider) {
    let label = 'Email Address';
    let placeholder = 'example@example.com';
    let type = 'email';
    const title = 'Request Login Code';

    if (provider === 'phone') {
      label = 'Phone Number';
      placeholder = '12223334444';
      type = 'number';
    }

    return (
      <div className="groupClass">
        <TextField
          id="outlined-text"
          type={type}
          label={label}
          onChange={handleEmailOrPhoneChange}
          value={emailOrPhone}
          placeholder={placeholder}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
        />

        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedRequestCode(provider)} color="primary">
          {title}
        </Button>
      </div>
    );
  }

  function normalizePhoneToInternational(phone) {
    let result = phone;

    // PhoneNumber crashes if you send it undefined/null
    if (phone) {
      const phoneValidator = PhoneNumber(phone);
      if (phoneValidator.isValid()) {
        result = phoneValidator.getNumber();
      } else {
        console.log('phone number is invalid');
      }
    }

    return result;
  }

  function handlePhoneChange(phone) {
    setEmailOrPhone(normalizePhoneToInternational(phone));
  }

  // for enter key on phone field
  // onKeyUp wasn't supported, using onKeyDown
  function handlePhoneKeyDown(e) {
    if (e.keyCode === 13) {
      clickedRequestCode('phone');
    }
  }

  function doAskRenderPhone() {
    const phoneProps = {
      required: true,
      autoFocus: true,
    };

    return (
      <ReactPhoneInput
        defaultCountry={'us'}
        inputExtraProps={phoneProps}
        countryCodeEditable={false}
        disableSearchIcon={true}
        enableSearchField={true}
        disableAreaCodes={true}
        value={emailOrPhone}
        placeholder="Your phone number"
        onChange={handlePhoneChange}
        onKeyDown={handlePhoneKeyDown}
      />
    );
  }

  function doRenderVerify(provider) {
    return (
      <div className="groupClass">
        <div className="message">
          Check your
          {provider}
          for the verification code and enter it below.
        </div>

        <TextField
          id="outlined-number"
          label="Verification Code"
          onChange={handleCodeChange}
          value={code}
          type="number"
          placeholder="123456"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
        />
        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => loginWithCode(provider)} color="primary">
          Login to ORE ID
        </Button>
      </div>
    );
  }

  // render busy if anything is busy
  // if (ore.isBusy()) {
  //   return doRenderBusy();
  // }

  function doRenderPage() {
    let contents = null;

    if (ore.waitingForLogin()) {
      contents = null;
    } else {
      // render by mode
      switch (mode) {
        case modeEnum.START:
          contents = doRenderStart();
          break;
        case modeEnum.ASK_EMAIL:
          contents = doRenderAsk('email');
          break;

        case modeEnum.ASK_PHONE:
          contents = doAskRenderPhone('phone');
          break;

        case modeEnum.VERIFY_EMAIL:
          contents = doRenderVerify('email');
          break;

        case modeEnum.VERIFY_PHONE:
          contents = doRenderVerify('phone');
          break;

        default:
          contents = <div>mode switch failed</div>;
          break;
      }
    }

    return (
      <div>
        <div className="boxClass">
          <div className="subtitleClass">Passwordless Login</div>
          {contents}
        </div>
      </div>
    );
  }

  return doRenderPage();
}

export default observer(PasswordlessLogin);
