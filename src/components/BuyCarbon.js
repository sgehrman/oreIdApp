import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import JSONDialog from './JSONDialog';
import styles from './BuyCarbon.module.scss';

console.log(styles);

const API_KEY = 'c0b723e5-6e44-47a5-9b4f-25f0f653f85c';
const ROOT = process.env.NODE_ENV === 'PRODUCTION' ? 'https://api.carbon.money' : 'https://sandbox.carbon.money';

function BuyCarbon(props) {
  const [jsonData, setJsonData] = useState(null);
  const [contactId, setContactId] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

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

  function load() {
    return new Promise((resolve, reject) => {
      const scriptId = 'carbon-money';
      const sourceUrl = 'https://carbon12.s3.amazonaws.com/carbonFiber.js';

      const [head] = document.getElementsByTagName('head');
      const js = document.createElement('script');

      js.id = scriptId;
      js.src = sourceUrl;

      js.onload = () => {
        if (!window) {
          reject(new Error('Google recaptcha is not available'));
        }

        resolve('success');
      };

      head.appendChild(js);
    });
  }

  // sandboxApiKey: c0b723e5-6e44-47a5-9b4f-25f0f653f85c
  // sandboxWebhookSecret: eq6ROQ7XXC

  // if (!window.CarbonWidget) {
  if (window === 'duh') {
    load().then((result) => {
      window.CarbonWidget.default.carbonFiber.render({
        clientName: 'Carbon Fiber',
        // options are sandbox or production
        environment: 'sandbox',
        tokens: 'eth',
        // currencies: "usd",
        homeScreenMessage: 'Buy ORE Tokens',
        // defaults can specify externally if you authenticate addresses
        // elsewhere say as a wallet
        receiveAddress: {
          eth: '',
          eos: '',
          trx: '',
          btt: '',
          btc: '',
          bnb: ''
        },
        apiKey: API_KEY, // update!
        // optional comma-delimited (no spaces) list of tokens to support
        // defaults to all
        // tokens: 'eth,eos,trx,btc,btt',
        targetContainerId: 'carbonfiber'
      });
    });
  }

  function showUserJWT(e) {
    const url = `${ROOT}/v1/users/returnJWT?apikey=${API_KEY}`;

    axios.get(url)
      .then((result) => {
        const { data } = result;
        const { jwtToken: jwt } = data;

        setJsonData(data);
        setJwtToken(jwt);
        console.log('Success', result);
      })
      .catch((err) => console.log('Error', err));
  }

  // "contactId":"a78bbf13-5e50-4a98-9e4d-3fd2ae101b0c"
  function createContact(e) {
    const url = `${ROOT}/v1/contacts/create`;

    const headers = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    };

    const postData = {
      emailAddress: 'satoshi@nakamoto.com',
      firstName: 'Satoshi',
      lastName: 'Nakamoto',
      companyName: 'Bitcoin Inc.'
    };

    axios.post(url, postData, headers)
      .then((result) => {
        const { data } = result;
        const { details } = data;
        const { contactId: cid } = details;

        setJsonData(data);
        setContactId(cid);
        console.log('Success', result);
      })
      .catch((err) => console.log('Error', err));
  }

  function showContacts(e) {
    const url = `${ROOT}/v1/contacts/current?contactId=${contactId}`;

    axios.get(url)
      .then((result) => {
        const { data } = result;

        setJsonData(data);
        console.log('Success', result);
      })
      .catch((err) => console.log('Error', err));

    const headers = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    };

    axios.get(url, headers)
      .then((result) => {
        const { data } = result;

        setJsonData(data);

        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  function createSuperUser(e) {
    const url = `${ROOT}/v1/create/super`;

    const data = {
      emailAddress: 'examplxxe@email.com',
      password: 'SecurePassword.1234',
      companyName: 'Company LLC',
      firstName: 'John',
      lastName: 'Doe'
    };
    // {"message":"Successfully created new user! Please record and save your UUID so Carbon Fiber's team can approve you",
    // "uuid":"5333a93b-7282-4e96-8bdc-788a3cf40067",
    // "jwtToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzMzYTkzYi03MjgyLTRlOTYtOGJkYy03ODhhM2NmNDAwNjciLCJzdXBlclVzZXIiOnRydWUsImNvbnRhY3QiOmZhbHNlLCJlbWFpbCI6ImV4YW1wbHh4ZUBlbWFpbC5jb20iLCJpYXQiOjE1NjQwOTIzOTF9.Ch8yi0Qm1XrSNBR8bgftizEHZG1gHkaBx1hXReoqpMc","webhookSecret":"M3jB16io5L"}
    axios.post(url, data).then((result) => console.log(result)).catch((err) => console.log(err));
  }

  return (
    <div>
      <div id="carbonfiber" />

      <div className={styles.buttons}>
        <Button onClick={createContact}>
          Create Contact
        </Button>

        <Button onClick={showContacts}>
          Show Contacts
        </Button>

        <Button onClick={showUserJWT}>
          User JWT
        </Button>

        <Button onClick={createSuperUser}>
          Create Super User
        </Button>

        <JSONDialog
          actionCallback={actionCallback}
          jsonData={jsonData}
        />

      </div>
    </div>
  );
}

export default BuyCarbon;
