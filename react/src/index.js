import React from 'react';
import { render } from 'react-dom';
import { useLocalStore } from 'mobx-react-lite';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import App from './App';
import ORE from './js/ore';
import './index.css';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    useNextVariants: true,
  },
});

function Root() {
  const model = useLocalStore(() => ({
    userInfo: {},
    isLoggedIn: false,
    results: null,
    resultsTitle: null,
    signState: null,
    clearErrors() {
      this.results = null;
      this.signState = null;
    },
  }));

  const ore = new ORE(model);

  return (
    <MuiThemeProvider theme={theme}>
      <App ore={ore} model={model} />
    </MuiThemeProvider>
  );
}

render(<Root />, document.getElementById('root'));
