
import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_SUCCESS,
    GET_PRODUCTID_ERROR,
    GET_PAYMENTID_START,
    GET_PAYMENTID_SUCCESS,
    GET_PAYMENTID_ERROR,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_ERROR,
    ADD_START_START,
    ADD_START_STOPADDED,
    ADD_START_ERROR,
    ADD_START_SUCCESS,
    ADD_END_START,
    ADD_END_STOPADDED,
    ADD_END_ERROR,
    ADD_END_SUCCESS,
    GET_STOPLIST_START,
    GET_STOPLIST_ERROR,
    GET_STOPLIST_SUCCESS,
    CALCULATE_TASK_START,
    CALCULATE_TASK_ERROR,
    CALCULATE_TASK_SUCCESS,
    UPDATE_STOPINFO_START,
    UPDATE_STOPINFO_ERROR,
    UPDATE_STOPINFO_SUCCESS
} from './action-types';


export const initialState = {
    fetchingProductList: false,
    fetchingPaymentList: false,
    creatingTask: false,
    fetchingStopList: false,
    calculatingTask: false,
    updatingStopinfo: false,
    productList: [],
    paymentList: [],
    tasktoken: null,
    productid: null,
    paymentid: null,
    reftime: null,
    fetchingStartStop: false,
    fetchingEndStop: false,
    stops: [],
    startStopsAdded: false,
    endStopsAdded: false,
    task: {}

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
            return Object.assign({},state, {fetchingProductList: false});
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
            return Object.assign({},state, {fetchingPaymentList: false});
        case CREATE_ORDER_SUCCESS:
            return Object.assign({}, state, {
                tasktoken: action.payload.tasktoken,
                productid: action.payload.productid,
                paymentid: action.payload.paymentid,
                reftime: action.payload.reftime
            });
        case CREATE_ORDER_ERROR:
            console.error(action.payload);
            return Object.assign({}, state, {
                tasktoken: null,
                productid: null,
                paymentid: null,
                reftime: null
            });
        case ADD_START_START:
            return Object.assign({}, state, {
                fetchingStartStop: true,
                startStopsAdded: false,
                stops: []
            });
        case ADD_START_STOPADDED:
            return Object.assign({}, state, {
                stops: [ ...state.stops, action.payload ]
            });
        case ADD_START_SUCCESS:
            return Object.assign({}, state, {
                fetchingStartStop: false,
                startStopsAdded: true
            });
        case ADD_START_ERROR:
            console.error(action.payload);
            return Object.assign({}, state, {
                fetchingStartStop: false,
                startStopsAdded: false,
                stops: [],
            });
        case ADD_END_START:
            return Object.assign({}, state, {
                fetchingEndStop: true,
                endStopsAdded: false,
                stops: [ state.stops[0], state.stops[1] ]
            });
        case ADD_END_STOPADDED:
            return Object.assign({}, state, {
                stops: [ ...state.stops, action.payload ]
            });
        case ADD_END_SUCCESS:
            return Object.assign({}, state, {
                fetchingEndStop: false,
                endStopsAdded: true
            });
        case ADD_END_ERROR:
            console.error(action.payload);
            return Object.assign({}, state, {
                fetchingEndStop: false,
                endStopsAdded: false,
                stops: [ state.stops[0], state.stops[1] ]
            });
        case GET_STOPLIST_START:
            return Object.assign({}, state, {
                fetchingStopList: true
            });
        case GET_STOPLIST_SUCCESS:
            let startStopsAdded = false;
            let endStopsAdded = false;
            if(action.payload.length > 0) {
                startStopsAdded = true;
            } else if(action.payload.length > 2) {
                endStopsAdded = true;
            }
            return Object.assign({}, state, {
                fetchingStopList: false,
                stops: [ ...action.payload ],
                startStopsAdded,
                endStopsAdded
            });
        case GET_STOPLIST_ERROR:
            console.error(action.payload);
            return Object.assign({}, state, {
                fetchingStopList: false,
                stop: [],
                startStopsAdded: false,
                endStopsAdded: false
            });
        case CALCULATE_TASK_START:
            return Object.assign({},state, {
                calculatingTask: true,
                task: {}
            });
        case CALCULATE_TASK_SUCCESS:
            return Object.assign({}, state, {
                calculatingTask: false,
                tasktoken: action.payload.tasktoken,
                task: action.payload.task
            });
        case CALCULATE_TASK_ERROR:
            return Object.assign({}, state, {
                calculatingTask: false,
                task: {},
                stops: []
            });
        case UPDATE_STOPINFO_START:
            return Object.assign({},state, {
                updatingStopinfo: true
            });
        case UPDATE_STOPINFO_SUCCESS:
            return Object.assign({},state, {
                updatingStopinfo: false
            });
        case UPDATE_STOPINFO_ERROR:
            console.error(action.payload);
            return Object.assign({},state, {
                updatingStopinfo: false
            });
        default:
            return state;
    }
}
