
import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_SUCCESS,
    GET_PRODUCTID_ERROR,
    GET_PAYMENTID_START,
    GET_PAYMENTID_SUCCESS,
    GET_PAYMENTID_ERROR,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_ERROR
} from './action-types';


export const initialState = {
    fetchingProductList: false,
    fetchingPaymentList: false,
    creatingTask: false,
    productList: [],
    paymentList: [],
    taskToken: null
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
            return {
                productList: [ ...state.productList ],
                paymentList: [ ...state.paymentList ],
                taskToken: action.payload
            };
        case CREATE_ORDER_ERROR:
            console.error(action.payload);
            return state;
        default:
            return state;
    }
}
