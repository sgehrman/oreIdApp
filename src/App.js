import React, { useState, useEffect } from 'react';
import { useLocalStore } from 'mobx-react-lite';
import PasswordlessLogin from './components/PasswordlessLogin';
import SocialLogin from './components/SocialLogin';
import Button from '@material-ui/core/Button';
import './App.scss';
import ORE from './js/ore';
import { observer } from 'mobx-react-lite';
import MessageBox from './components/MessageBox';
import UserInfo from './components/UserInfo';

const modeEnum = {
  START: 'start',
  SHOW_SOCIAL: 'social',
  SHOW_PASSWORDLESS: 'passwordless',
};

const buttonMargin = {
  marginBottom: '6px',
};

function App() {
  const [mode, setMode] = useState(modeEnum.START);

  const model = useLocalStore(() => ({
    results: '',
    userInfo: {},
    isLoggedIn: false,
  }));

  const ore = new ORE(model);

  // Similar to componentDidMount
  useEffect(() => {
    ore.loadUserFromLocalState();
    ore.handleAuthCallback();
    ore.handleSignCallback();
  }, []);

  function clickedLoginStyle(provider) {
    setMode(provider);
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
      </div>
    );
  }

  function doRender() {
    let contents = null;
    const isBusy = ore.isBusy();

    if (model.isLoggedIn) {
      contents = <UserInfo ore={ore} model={model} />;
    } else {
      switch (mode) {
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
            <div className="titleClass">ORE ID</div>
            <div className="subtitleClass">by AIKON</div>
            {contents}
          </div>

          <div className="boxClass">
            <MessageBox isBusy={isBusy} model={model} />
          </div>
        </div>
      </div>
    );
  }

  return doRender();
}

export default observer(App);
