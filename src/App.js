import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import PasswordlessLogin from './components/PasswordlessLogin';
import SocialLogin from './components/SocialLogin';
import './App.scss';
import MessageBox from './components/MessageBox';
import UserInfo from './components/UserInfo';
import modeEnum from './js/enums';
import DiscoveryButtons from './components/DiscoveryButtons';
import SigningOptions from './components/SigningOptions';
import SettingsDialog from './components/SettingsDialog';
import BuyCarbon from './components/BuyCarbon';

const buttonMargin = {
  marginBottom: '6px'
};

function App(props) {
  const { model, ore } = props;

  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');

  function loadFromStorage() {
    let p = localStorage.getItem('phone');
    if (p && p.length) {
      setPhone(p);
    }

    p = localStorage.getItem('email');
    if (p && p.length) {
      setEmail(p);
    }
  }

  // Similar to componentDidMount
  useEffect(() => {
    ore.loadUserFromLocalState();
    ore.handleAuthCallback();
    ore.handleSignCallback();
    loadFromStorage();
  }, [ore]);

  function clickedLoginStyle(provider) {
    model.mode = provider;
  }

  function showGitHub() {
    window.open('https://github.com/sgehrman/oreIdApp', '_blank').focus();
  }

  function doRenderStart() {
    return (
      <div className="groupClass">
        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedLoginStyle(modeEnum.SHOW_SOCIAL)} color="primary">
          Social Login
        </Button>

        <Button style={buttonMargin} variant="outlined" size="small" onClick={() => clickedLoginStyle(modeEnum.SHOW_PASSWORDLESS)} color="primary">
          Passwordless Login
        </Button>

        <Button size="small" onClick={showGitHub}>
          Code on GitHub
        </Button>
      </div>
    );
  }

  function doRender() {
    let contents = null;
    const isBusy = ore.isBusy();

    if (model.isLoggedIn) {
      contents = (
        <div>
          <UserInfo ore={ore} model={model} />
          <SigningOptions ore={ore} model={model} />
          <DiscoveryButtons ore={ore} model={model} />
          <BuyCarbon ore={ore} model={model} />
        </div>
      );
    } else {
      switch (model.mode) {
        case modeEnum.SHOW_PASSWORDLESS:
          contents = <PasswordlessLogin ore={ore} model={model} phone={phone} email={email} />;
          break;
        case modeEnum.SHOW_SOCIAL:
          contents = <SocialLogin ore={ore} model={model} />;
          break;
        default:
          contents = doRenderStart();
          break;
      }
    }

    return (
      <div className="app">
        <div className="app-content">
          <SettingsDialog ore={ore} model={model} />

          <div className="boxClass">
            <div className="titleClass">ORE ID TEST</div>
            <div className="subtitleClass">by Sasquatch</div>
            {contents}
          </div>

          <MessageBox isBusy={isBusy} model={model} />
        </div>
      </div>
    );
  }

  return doRender();
}

export default observer(App);
