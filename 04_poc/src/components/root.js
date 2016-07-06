import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute } from 'react-router';

// config
import { SIGN_IN_PATH, TASKS_PATH, ORDERS_PATH } from 'src/config';

// components
import App from './app/app';
import SignIn from './sign-in/sign-in';
import Tasks from './tasks/tasks';
import Orders from './orders/orders';
import OrdersStep1 from './orders/orders-step1';
import OrdersStep2 from './orders/orders-step2';
import OrdersStep3 from './orders/orders-step3';
import Home from './home/home';


export default function Root({history, onEnter, store}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} onEnter={onEnter} path="/">
          <IndexRoute component={Home} />
          <Route component={Orders} path={ORDERS_PATH}>
            <IndexRoute component={OrdersStep1} path={ORDERS_PATH + '/step1'} />
            <Route component={OrdersStep2} path={ORDERS_PATH + '/step2'} />
            <Route component={OrdersStep3} path={ORDERS_PATH + '/step3'} />
          </Route>
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
