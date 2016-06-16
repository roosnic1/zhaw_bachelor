import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute } from 'react-router';

// config
import { SIGN_IN_PATH, TASKS_PATH } from 'src/config';

// components
import App from './app/app';
import SignIn from './sign-in/sign-in';
import Tasks from './tasks/tasks';
import Orders from './orders/orders';


export default function Root({history, onEnter, store}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} onEnter={onEnter} path="/">
          <IndexRoute component={Orders} />
          <Route component={SignIn} path={SIGN_IN_PATH} />
          <Route component={Tasks} path={TASKS_PATH} />
        </Route>
      </Router>
    </Provider>
  );
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  onEnter: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired
};
