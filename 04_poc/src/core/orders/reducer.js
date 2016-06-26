
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
    ADD_END_SUCCESS
} from './action-types';


export const initialState = {
    fetchingProductList: false,
    fetchingPaymentList: false,
    creatingTask: false,
    productList: [],
    paymentList: [],
    taskToken: null,
    fetchingStartStop: false,
    fetchingEndStop: false,
    stops: [],
    startStopsAdded: false,
    endStopsAdded: false

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
                    [ ...state.productList ],
                taskToken: null,
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
                    [ ...state.paymentList ],
                taskToken: null,
            });
        case GET_PAYMENTID_ERROR:
            console.error(action.payload);
            return Object.assign({},state, {fetchingPaymentList: false});
        case CREATE_ORDER_SUCCESS:
            return Object.assign({}, state, {
                productList: [ ...state.productList ],
                paymentList: [ ...state.paymentList ],
                taskToken: action.payload
            });
        case CREATE_ORDER_ERROR:
            console.error(action.payload);
            return state;
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
        case ADD_START_ERROR:
            console.error(action.payload);
            return Object.assign({}, state, {
                fetchingEndStop: false,
                endStopsAdded: false,
                stops: [ state.stops[0], state.stops[1] ]
            });
        default:
            return state;
    }
}
