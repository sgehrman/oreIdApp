import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ProviderStyles from '../assets/providerStyles';

class WalletButton extends Component {
  constructor(props) {
    super(props);

    const { provider } = props;

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

    const defaultButtonStyle = {
      margin: '6px',
      color: '#ffffff',
      width: 'auto'
    };

    const contentStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    };

    const defaultLogoStyle = {
      width: '24px',
      height: 'auto'
    };

    const buttonOptions = ProviderStyles.styleForProvider(provider);
    const logoPath = ProviderStyles.logoForProvider(provider);

    const buttonStyle = {
      ...buttonOptions.buttonStyle,
      ...defaultButtonStyle
    };

    const logoStyle = {
      ...buttonOptions.logoStyle,
      ...defaultLogoStyle
    };

    return (
      <div>
        <Button
          style={buttonStyle}
          onClick={() => {
            onClickCallback(provider);
          }}
        >
          <div style={contentStyle}>
            <img style={logoStyle} src={logoPath} alt={buttonOptions.text} />
            {buttonOptions.text}
          </div>
        </Button>
      </div>
    );
  }
}

export default WalletButton;
