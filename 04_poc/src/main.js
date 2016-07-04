import 'babel-polyfill';
import './styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { authRouteResolver } from './core/auth';
import configureStore from './core/store';
import Root from './components/root';

import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


const store = configureStore();
const syncedHistory = syncHistoryWithStore(browserHistory, store);
const onEnter = authRouteResolver(store.getState);
const rootElement = document.getElementById('root');


// needed for material UI
injectTapEventPlugin();

function render(Root) {
  ReactDOM.render(
    <AppContainer>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Root
          history={syncedHistory}
          onEnter={onEnter}
          store={store}
        />
      </MuiThemeProvider>
    </AppContainer>,
    rootElement
  );
}

if (module.hot) {
  module.hot.accept('./components/root', () => {
    render(require('./components/root').default);
  });
}

render(Root);
/* initAuth(store.dispatch)
  .then(() => render(Root))
  .catch(error => console.error(error)); */ // eslint-disable-line no-console
