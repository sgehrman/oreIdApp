import React from 'react';
import { observer } from 'mobx-react-lite';
import ENV from '../js/env';
import UserLoginView from './UserLoginView';
import DiscoveryButtons from './DiscoveryButtons';
import SigningOptions from './SigningOptions';

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
    const { isLoggedIn } = model;
    let contents = null;

    if (!isLoggedIn) {
      contents = <UserLoginView clickedLogin={handleLogin} />;
    } else {
      contents = (
        <div>
          <SigningOptions ore={ore} model={model} />
          <DiscoveryButtons ore={ore} model={model} />
        </div>
      );
    }

    return (
      <div className="groupClass">
        <div className="subtitleClass">Social Login</div>
        {contents}
      </div>
    );
  }

  return doRender();
}

export default observer(PasswordlessLogin);
