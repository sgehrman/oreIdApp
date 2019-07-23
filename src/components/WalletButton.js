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
      margin: '8px',
      fontSize: '.4em',
      width: 'auto'
    };

    const contentStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    };

    const buttonOptions = ProviderStyles.styleForProvider(provider);
    const logoPath = ProviderStyles.logoForProvider(provider);

    const buttonStyle = {
      ...buttonOptions.buttonStyle,
      ...defaultButtonStyle
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
            <img style={buttonOptions.logoStyle} src={logoPath} alt={buttonOptions.text} />
            {buttonOptions.text}
          </div>
        </Button>
      </div>
    );
  }
}

export default WalletButton;
