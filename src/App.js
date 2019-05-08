import React, { useState, useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import PasswordlessLogin from './components/PasswordlessLogin';
import SocialLogin from './components/SocialLogin';
import './App.scss';
import ORE from './js/ore';
import MessageBox from './components/MessageBox';
import UserInfo from './components/UserInfo';
import modeEnum from './js/enums';
import DiscoveryButtons from './components/DiscoveryButtons';
import SigningOptions from './components/SigningOptions';

const buttonMargin = {
  marginBottom: '6px',
};

function App() {
  const model = useLocalStore(() => ({
    results: '',
    userInfo: {},
    isLoggedIn: false,
    mode: modeEnum.START,
  }));

  const ore = new ORE(model);

  // Similar to componentDidMount
  useEffect(() => {
    ore.loadUserFromLocalState();
    ore.handleAuthCallback();
    ore.handleSignCallback();
  }, []);

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
        </div>
      );
    } else {
      switch (model.mode) {
        case modeEnum.SHOW_PASSWORDLESS:
          contents = <PasswordlessLogin ore={ore} model={model} />;
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
