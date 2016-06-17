import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_ERROR,
    GET_PRODUCTID_SUCCESS,
    GET_PAYMENTID_START,
    GET_PAYMENTID_ERROR,
    GET_PAYMENTID_SUCCESS,
    CREATE_ORDER_ERROR,
    CREATE_ORDER_SUCCESS,
    ADD_STOP_ERROR,
    ADD_STOP_SUCCESS,
    UPDATE_ORDER_ERROR,
    UPDATE_ORDER_SUCCESS
} from './action-types';

import { CUSTOMBER_NUMBER } from '../../config';

export function getProductId() {
    return(dispatch) => {
        dispatch({type:GET_PRODUCTID_START,payload:null});
        fetch('/api/v1/productList')
            .then(data => data.json())
            .then(json => dispatch({
                type: GET_PRODUCTID_SUCCESS,
                payload: json
            }))
            .catch(error => dispatch({
                type: GET_PRODUCTID_ERROR,
                payload: {err:'fetchError',data:error}
            }));
    };
}

export function getPaymentId() {
    return(dispatch)  => {
        dispatch({type:GET_PAYMENTID_START,payload:null});
        fetch('/api/v1/paymentlist')
            .then(data => data.json())
            .then(json => dispatch({
                type: GET_PAYMENTID_SUCCESS,
                payload: json
            }))
            .catch(error => dispatch({
                type: GET_PAYMENTID_ERROR,
                payload: {err:'fetchError',data:error}
            }));
    };
}

export function createTask(productId,paymentId) {
    return(dispatch) => {
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({productid: productId,paymentid: paymentId,customernumber:CUSTOMBER_NUMBER})
        };
        fetch('/api/v1/createtask',opt)
            .then(data => data.json())
            .then(json => {
                console.log(json);
                if(json.statuscode === 1) {
                    dispatch({
                        type: CREATE_ORDER_SUCCESS,
                        payload: json.tasktoken
                    });
                } else {
                    dispatch({
                        type: CREATE_ORDER_ERROR,
                        payload: {error:'apiError',data:json}
                    });
                }
            })
            .catch(error => dispatch({
                type: CREATE_ORDER_ERROR,
                payload: {err:'fetchError',data:error}
            }));
    }
}

/*export function registerListeners() {
    return (dispatch, getState) => {
        const { auth } = getState();
        const ref = firebaseDb.ref(`tasks/${auth.id}`);

        ref.on('child_added', snapshot => dispatch({
            type: CREATE_TASK_SUCCESS,
            payload: recordFromSnapshot(snapshot)
        }));

        ref.on('child_changed', snapshot => dispatch({
            type: UPDATE_TASK_SUCCESS,
            payload: recordFromSnapshot(snapshot)
        }));

        ref.on('child_removed', snapshot => dispatch({
            type: DELETE_TASK_SUCCESS,
            payload: recordFromSnapshot(snapshot)
        }));
    };
}*/
