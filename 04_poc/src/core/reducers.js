import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { ordersReducer } from './orders';


export default combineReducers({
  auth: authReducer,
  routing: routerReducer,
  orders: ordersReducer
});
