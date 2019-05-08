import React from 'react';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react-lite';
import ENV from '../js/env';
import UserLoginView from './UserLoginView';
import modeEnum from '../js/enums';

function PasswordlessLogin(props) {
  const { ore, model } = props;

  async function handleLogin(provider) {
    const args = { provider, chainNetwork: ENV.chainNetwork };

    const loginResponse = await ore.login(args);
    if (loginResponse) {
      const { loginUrl } = loginResponse;
      // if the login responds with a loginUrl, then redirect the browser to it to start the user's OAuth login flow
      if (loginUrl) {
        window.location = loginUrl;
      } else {
        ore.displayResults('loginUrl was null', 'Error');
      }
    }
  }

  function doRender() {
    return (
      <div className="groupClass">
        <div className="header-title">Social Login</div>
        <Button
          onClick={() => {
            model.mode = modeEnum.START;
          }}
        >
          Back
        </Button>

        <UserLoginView clickedLogin={handleLogin} />
      </div>
    );
  }

  return doRender();
}

export default observer(PasswordlessLogin);
