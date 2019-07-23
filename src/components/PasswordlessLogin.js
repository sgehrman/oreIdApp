import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import PhoneNumber from 'awesome-phonenumber';
import modeEnum from '../js/enums';

const localModeEnum = {
  START: 'start',
  ASK_EMAIL: 'askEmail',
  ASK_PHONE: 'askPhone',
  VERIFY_EMAIL: 'verifyEmail',
  VERIFY_PHONE: 'verifyPhone'
};

const buttonMargin = {
  marginBottom: '6px'
};
const buttonMarginTop = {
  marginTop: '6px'
};

function PasswordlessLogin(props) {
  // NOTE: we are using React hooks 'useState'. This is just like React's this.state in React component classes
  // See this link for more information: https://reactjs.org/docs/hooks-overview.html
  const { ore, model, email: savedEmail, phone: savedPhone } = props;

  const [email, setEmail] = useState(savedEmail);
  const [phone, setPhone] = useState(savedPhone);
  const [code, setCode] = useState('');
  const [mode, setMode] = useState(localModeEnum.START);

  // Similar to componentDidMount
  useEffect(() => {
    ore.loadUserFromLocalState();
    ore.handleAuthCallback();
  }, []);

  function handleEmailChange(e) {
    const { value } = e.target;
    setEmail(value);
  }

  function handleCodeChange(e) {
    const { value } = e.target;
    setCode(value);
  }

  async function loginWithCode(provider) {
    const args = { provider, code, chainNetwork: ore.env().chainNetwork };
    switch (provider) {
      case 'phone':
        args.phone = phone;
        break;
      case 'email':
        args.email = email;
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
        setMode(localModeEnum.ASK_EMAIL);
        break;
      case 'phone':
        setMode(localModeEnum.ASK_PHONE);
        break;
      default:
        console.log('login style switch failed');
        break;
    }
  }

  async function clickedRequestCode(provider) {
    const args = {
      provider
    };

    switch (provider) {
      case 'phone':
        args.phone = phone;
        localStorage.setItem('phone', phone);

        break;
      case 'email':
        args.email = email;
        localStorage.setItem('email', email);

        break;
      default:
        console.log('login switch not handled');
    }

    const result = await ore.passwordlessSendCode(args);

    if (result.success === true) {
      switch (provider) {
        case 'email':
          setMode(localModeEnum.VERIFY_EMAIL);
          break;
        case 'phone':
          setMode(localModeEnum.VERIFY_PHONE);
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

  function doRenderAskEmail() {
    return (
      <div className="groupClass">
        <TextField
          id="outlined-text"
          type="email"
          label="Email Address"
          onChange={handleEmailChange}
          value={email}
          placeholder="example@example.com"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />

        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedRequestCode('email')} color="primary">
          Request Login Code
        </Button>
      </div>
    );
  }

  function normalizePhoneToInternational(inPhone) {
    let result = inPhone;

    // PhoneNumber crashes if you send it undefined/null
    if (inPhone) {
      const phoneValidator = PhoneNumber(inPhone);
      if (phoneValidator.isValid()) {
        result = phoneValidator.getNumber();
      } else {
        console.log('phone number is invalid');
      }
    }

    return result;
  }

  function handlePhoneChange(inPhone) {
    setPhone(normalizePhoneToInternational(inPhone));
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
      autoFocus: true
    };

    return (
      <div className="groupClass">
        <ReactPhoneInput
          defaultCountry="us"
          inputExtraProps={phoneProps}
          countryCodeEditable={false}
          disableSearchIcon
          enableSearchField
          disableAreaCodes
          value={phone}
          placeholder="Your phone number"
          onChange={handlePhoneChange}
          onKeyDown={handlePhoneKeyDown}
        />
        <Button style={buttonMarginTop} variant="outlined" size="small" onClick={() => clickedRequestCode('phone')} color="primary">
          Request Login Code
        </Button>
      </div>
    );
  }

  function doRenderVerify(provider) {
    const message = `Check your ${provider} for the verification code and enter it below.`;

    return (
      <div className="groupClass">
        <div className="message">{message}</div>

        <TextField
          id="outlined-number"
          label="Verification Code"
          onChange={handleCodeChange}
          value={code}
          type="number"
          placeholder="123456"
          InputLabelProps={{
            shrink: true
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
        case localModeEnum.START:
          contents = doRenderStart();
          break;
        case localModeEnum.ASK_EMAIL:
          contents = doRenderAskEmail();
          break;

        case localModeEnum.ASK_PHONE:
          contents = doAskRenderPhone();
          break;

        case localModeEnum.VERIFY_EMAIL:
          contents = doRenderVerify('email');
          break;

        case localModeEnum.VERIFY_PHONE:
          contents = doRenderVerify('phone');
          break;

        default:
          contents = <div>mode switch failed</div>;
          break;
      }
    }

    return (
      <div className="groupClass">
        <div className="header-title">Passwordless Login</div>
        <Button
          onClick={() => {
            model.mode = modeEnum.START;
          }}
        >
          Go Back
        </Button>

        <div className="boxClass">{contents}</div>
      </div>
    );
  }

  return doRenderPage();
}

export default observer(PasswordlessLogin);
