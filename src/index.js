import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useLocalStore } from 'mobx-react-lite';
import App from './App';
import ORE from './js/ore';
import modeEnum from './js/enums';

// we put the model here so it would not get recreated as App is re-rendered
// otherwise we could have two ore's floating around
function AppRoot() {
  const p = localStorage.getItem('prod');

  let prod = false;
  if (p) {
    prod = true;
  }

  const model = useLocalStore(() => ({
    results: '',
    userInfo: {},
    isLoggedIn: false,
    mode: modeEnum.START,
    prod
  }));

  const ore = new ORE(model);

  return (<App model={model} ore={ore} />);
}

ReactDOM.render(<AppRoot />, document.getElementById('root'));
