import React from 'react';
import SocialLoginButton from './SocialLoginButton';

function UserLoginView(props) {
  function renderLoginButtons() {
    const { clickedLogin } = props;

    const providers = [
      'facebook',
      'twitter',
      'github',
      'twitch',
      'line',
      'kakao',
      'linkedin',
      'google',
      'email',
      'phone',
      // new additions, not tested
      'scatter',
      'ledger',
      'meetone',
      'lynx',
      'portis',
      'whalevault',
      'simpleos',
      'keycat'
    ];

    const buttons = providers.map((provider) => {
      return (
        <SocialLoginButton
          provider={provider}
          onClick={() => clickedLogin(provider)}
        />
      );
    });

    return (
      <div>
        {buttons}
      </div>
    );
  }

  return <div>{renderLoginButtons()}</div>;
}

export default UserLoginView;
