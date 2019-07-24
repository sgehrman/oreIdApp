import React from 'react';
import WalletButton from './WalletButton';

function DiscoveryButtons(props) {
  const { ore, model } = props;

  const buttonBox = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '20px',
    flexDirection: 'column'
  };
  const innerButtonBox = {
    display: 'flex',
    flexDirection: 'column'
  };
  const buttonGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const chainNetwork = ore.env().chainNetwork;

  const walletButtons = [
    { provider: 'scatter', chainNetwork },
    { provider: 'ledger', chainNetwork },
    { provider: 'lynx', chainNetwork },
    { provider: 'meetone', chainNetwork },
    { provider: 'tokenpocket', chainNetwork }
  ];

  async function handleWalletDiscoverButton(permissionIndex) {
    try {
      ore.displayResults();

      const { provider } = walletButtons[permissionIndex] || {};
      await ore.discover({ provider, chainNetwork: ore.env().chainNetwork });

      ore.loadUserFromApi(model.userInfo.accountName); // reload user from ore id api - to show new keys discovered
    } catch (error) {
      ore.displayResults(error, 'Error');
    }
  }

  return (
    <div className="boxClass">
      <div style={buttonBox}>
        <div style={innerButtonBox}>
          <div>
            <div>
              <div className="header-title">Or discover a key in your wallet</div>
              <div style={buttonGroupStyle}>
                {walletButtons.map((wallet, index) => {
                  const provider = wallet.provider;
                  return (
                    <div key={provider}>
                      <WalletButton
                        provider={provider}
                        data-tag={index}
                        onClick={() => {
                          handleWalletDiscoverButton(index);
                        }}
                      >
                        {`${provider}`}
                      </WalletButton>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoveryButtons;
