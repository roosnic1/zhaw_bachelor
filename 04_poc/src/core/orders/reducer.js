
import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_SUCCESS,
    GET_PRODUCTID_ERROR,
    GET_PAYMENTID_START,
    GET_PAYMENTID_SUCCESS,
    GET_PAYMENTID_ERROR,
    GET_CONNECTIONS_START,
    GET_CONNECTIONS_ERROR,
    GET_CONNECTIONS_SUCCESS,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_ERROR,
    ADD_STOP_START,
    ADD_STOP_ERROR,
    ADD_STOP_SUCCESS,
    UPDATE_REFTIME_START,
    UPDATE_REFTIME_ERROR,
    UPDATE_REFTIME_SUCCESS,
    COMPILE_TASK_START,
    COMPILE_TASK_ERROR,
    COMPILE_TASK_SUCCESS,
    CALCULATE_TASK_START,
    CALCULATE_TASK_ERROR,
    CALCULATE_TASK_SUCCESS,
    UPDATE_STOPINFO_START,
    UPDATE_STOPINFO_ERROR,
    UPDATE_STOPINFO_SUCCESS,
    ORDER_TASK_START,
    ORDER_TASK_ERROR,
    ORDER_TASK_SUCCESS
} from './action-types';


export const initialState = {
  fetchingProductList: false,
  fetchingPaymentList: false,
  fetchtingConnections: false,
  creatingTask: false,
  fetchingStopList: false,
  addingStop: false,
  calculatingTask: false,
  compilingTask: false,
  updatingStopinfo: false,
  orderingTask: false,
  productList: [],
  paymentList: [],
  tasktoken: null,
  productid: null,
  paymentid: null,
  reftime: null,
  stops: [],
  task: null,
  connections: [],
  taskStatus: null
};


export function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTID_START:
      return Object.assign({}, state, {fetchingProductList: true});
    case GET_PRODUCTID_SUCCESS:
      return Object.assign({}, state, {
        fetchingProductList: false,
        productList: (action.payload && action.payload.length > 0) ?
                    [ ...action.payload ] :
                    [ ]
      });
    case GET_PRODUCTID_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {fetchingProductList: false});
    case GET_PAYMENTID_START:
      return Object.assign({}, state, {fetchingPaymentList: true});
    case GET_PAYMENTID_SUCCESS:
      return Object.assign({}, state, {
        fetchingPaymentList: false,
        paymentList: (action.payload && action.payload.length > 0) ?
                    [ ...action.payload ] :
                    [ ]
      });
    case GET_PAYMENTID_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {fetchingPaymentList: false});
    case CREATE_ORDER_SUCCESS:
      return Object.assign({}, state, {
        tasktoken: action.payload.tasktoken,
        productid: action.payload.productid,
        paymentid: action.payload.paymentid,
        reftime: action.payload.reftime
      });
    case GET_CONNECTIONS_START:
      return Object.assign({}, state, {fetchtingConnections: true});
    case GET_CONNECTIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchtingConnections: false,
        connections: action.payload
      });
    case GET_CONNECTIONS_ERROR:
      return Object.assign({}, state, {
        fetchtingConnections: false,
        connections: []
      });
    case CREATE_ORDER_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {
        tasktoken: null,
        productid: null,
        paymentid: null,
        reftime: null
      });
    case ADD_STOP_START:
      return Object.assign({}, state, {
        addingStop: true
      });
    case ADD_STOP_SUCCESS:
      return Object.assign({}, state, {
        addingStop: false,
        stops: [ ...state.stops, action.payload ]
      });
    case ADD_STOP_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {
        addingStop: false
      });
    case UPDATE_REFTIME_SUCCESS:
      return Object.assign({},state, {
        reftime: action.payload
      });
    case COMPILE_TASK_START:
      return Object.assign({}, state, {
        compilingTask: true,
        task: null
      });
    case COMPILE_TASK_SUCCESS:
      return Object.assign({}, state, {
        compilingTask: false,
        task: action.payload.task,
        stops: action.payload.stops,
        tasktoken: action.payload.tasktoken
      });
    case COMPILE_TASK_ERROR:
      return Object.assign({}, state, {
        compilingTask: false,
        task: null
      });
    case CALCULATE_TASK_START:
      return Object.assign({}, state, {
        calculatingTask: true,
        task: null
      });
    case CALCULATE_TASK_SUCCESS:
      return Object.assign({}, state, {
        calculatingTask: false,
        task: action.payload.task,
        stops: action.payload.stops,
        tasktoken: action.payload.tasktoken,
        reftime: action.payload.reftime !== 0 ? action.payload.reftime : state.reftime
      });
    case CALCULATE_TASK_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {
        calculatingTask: false,
        task: null,
        stops: []
      });
    case UPDATE_STOPINFO_START:
      return Object.assign({}, state, {
        updatingStopinfo: true
      });
    case UPDATE_STOPINFO_SUCCESS:
      return Object.assign({}, state, {
        updatingStopinfo: false
      });
    case UPDATE_STOPINFO_ERROR:
      console.error(action.payload);
      return Object.assign({}, state, {
        updatingStopinfo: false
      });
    case ORDER_TASK_START:
      return Object.assign({}, state, {
        orderingTask: true,
        taskStatus: null
      });
    case ORDER_TASK_SUCCESS:
      return Object.assign({}, state, {
        orderingTask: false,
        taskStatus: action.payload
      });
    case ORDER_TASK_ERROR:
      return Object.assign({}, state, {
        orderingTask: false,
        taskStatus: null
      });
    default:
      return state;
  }
}
