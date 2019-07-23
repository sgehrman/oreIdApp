import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ProviderStyles from '../assets/providerStyles';

class SignButton extends Component {
  constructor(props) {
    super(props);

    const { provider } = this.props;

    if (!ProviderStyles.isProviderValid(provider)) {
      throw Error(`${provider} is not one of the supported providers.`);
    }

    this.state = {
      provider,
      onClickCallback: this.props.onClick
    };
  }

  render() {
    // TODO: Check that provider is one of the valid types
    const { provider, onClickCallback } = this.state;

    const buttonOptions = ProviderStyles.styleForProvider(provider, 'Sign with');
    const logoPath = ProviderStyles.logoForProvider(provider);

    const logoStyle = {
      ...buttonOptions.logoStyle,
      marginRight: '8px'
    };

    return (
      <div>
        <Button
          variant="outlined"
          style={buttonOptions.buttonStyle}
          onClick={() => {
            onClickCallback(provider);
          }}
        >
          <img style={logoStyle} src={logoPath} alt={buttonOptions.text} />
          {buttonOptions.text}
        </Button>
      </div>
    );
  }
}

export default SignButton;
