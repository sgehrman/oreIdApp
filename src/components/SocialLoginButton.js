import React from 'react';
import Button from '@material-ui/core/Button';
import ProviderStyles from '../assets/providerStyles';

function SocialLoginButton(props) {
  const { provider } = props;

  // will console.log if not valid
  ProviderStyles.isProviderValid(provider);

  const buttonOptions = ProviderStyles.styleForProvider(provider, 'Login with');
  const logoPath = ProviderStyles.logoForProvider(provider);

  return (
    <div>
      <Button
        variant="contained"
        style={buttonOptions.buttonStyle}
        onClick={() => {
          props.onClick(provider);
        }}
      >
        <img style={buttonOptions.logoStyle} src={logoPath} alt={buttonOptions.text} />
        {buttonOptions.text}
      </Button>
    </div>
  );
}

export default SocialLoginButton;
