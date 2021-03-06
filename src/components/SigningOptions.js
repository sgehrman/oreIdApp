import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import SignButton from './SignButton';
import Utils from '../js/utils';
import JSONDialog from './JSONDialog';

function SigningOptions(props) {
  const { model, ore } = props;
  const { permissions } = model.userInfo;
  const [jsonData, setJsonData] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('Results');

  const permissionsToRender = (permissions || []).slice();

  function actionCallback(action) {
    switch (action) {
      case 'close':
        setJsonData(null);
        break;
      default:
        console.log('Switch statement hit default: action callback', action);
        break;
    }
  }

  async function handleSignSampleTransaction(provider, account, chainAccount, chainNetwork, permission) {
    try {
      ore.displayResults();

      const transaction = Utils.createSampleTransaction(chainAccount, permission);
      const signOptions = {
        allowChainAccountSelection: true, // Shows "Sign with External wallet" on Sign screen
        provider: provider || '', // wallet type (e.g. 'scatter' or 'oreid')
        account: account || '',
        broadcast: false, // if broadcast=true, ore id will broadcast the transaction to the chain network for you
        chainAccount: chainAccount || '',
        chainNetwork: chainNetwork || '',
        state: 'abc', // anything you'd like to remember after the callback
        transaction,
        accountIsTransactionPermission: false,
        returnSignedTransaction: true,
        signExternalWithOreId: true // optional to test PIN window signing for external wallets
      };
      const signResponse = await ore.sign(signOptions);
      // if the sign responds with a signUrl, then redirect the browser to it to call the signing flow
      const { signUrl, signedTransaction } = signResponse || {};
      if (signUrl) {
        // redirect browser to signUrl
        window.location = signUrl;
      }
      if (signedTransaction) {
        setDialogTitle('Signed transaction');
        setJsonData(signedTransaction);

        // result display
        ore.displayResults(signedTransaction, 'Signed transaction');
      }
    } catch (error) {
      ore.displayResults(error, 'Error');
    }
  }

  async function handleSignButton(permissionIndex) {
    ore.displayResults();

    const { chainAccount, chainNetwork, permission, externalWalletType: provider } = permissionsToRender[permissionIndex] || {};
    const { accountName } = model.userInfo;
    // default to ore id
    await handleSignSampleTransaction(provider || 'oreid', accountName, chainAccount, chainNetwork, permission);
  }

  // render one sign transaction button for each chain
  function renderSignButtons() {
    return permissionsToRender.map((permission, index) => {
      const provider = permission.externalWalletType || 'oreid';
      const key = provider + permission + permission.chainAccount + permission.chainNetwork;

      return (
        <div className="sign-button-group" key={key}>
          <SignButton
            provider={provider}
            text={`Sign with ${provider}`}
            onClick={() => {
              handleSignButton(index);
            }}
          >
            {`Sign Transaction with ${provider}`}
          </SignButton>
          <div className="button-message">{`Chain:${permission.chainNetwork} ---- Account:${permission.chainAccount} ---- Permission:${permission.permission}`}</div>
        </div>
      );
    });
  }

  return (
    <div className="boxClass">
      <div className="header-title">Sign transaction with one of your keys</div>
      <div>{renderSignButtons()}</div>

      <JSONDialog
        actionCallback={actionCallback}
        jsonData={jsonData}
        title={dialogTitle}
      />

    </div>
  );
}

export default observer(SigningOptions);
