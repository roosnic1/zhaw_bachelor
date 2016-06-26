import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_ERROR,
    GET_PRODUCTID_SUCCESS,
    GET_PAYMENTID_START,
    GET_PAYMENTID_ERROR,
    GET_PAYMENTID_SUCCESS,
    CREATE_ORDER_START,
    CREATE_ORDER_ERROR,
    CREATE_ORDER_SUCCESS,
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
    UPDATE_ORDER_ERROR,
    UPDATE_ORDER_SUCCESS
} from './action-types';

import { CUSTOMBER_NUMBER } from '../../config';

export function getProductId() {
    return(dispatch) => {
        dispatch({type:GET_PRODUCTID_START,payload:null});
        return fetch('/api/v1/productList')
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
        return fetch('/api/v1/paymentlist')
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
        dispatch({type:CREATE_ORDER_START,payload:null});
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({productid: productId,paymentid: paymentId,customernumber:CUSTOMBER_NUMBER})
        };
        return fetch('/api/v1/createtask',opt)
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
                        payload: {err:'apiError',data:json}
                    });
                }
            })
            .catch(error => dispatch({
                type: CREATE_ORDER_ERROR,
                payload: {err:'fetchError',data:error}
            }));
    }
}

export function addStartAddress(taskToken,address) {
    return(dispatch) => {
        dispatch({type:ADD_START_START,payload:null});
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                type: 'address',
                params: Object.assign({tasktoken: taskToken}, address)
            })
        };
        
        return fetch('/api/v1/addstop',opt)
            .then(data => data.json())
            .then(json => {
                if(json.statuscode > 0) {
                    dispatch({
                        type: ADD_START_STOPADDED,
                        payload: json.stop
                    });
                    const getTrainstation = {
                        'method': 'POST',
                        'headers': {'Content-Type': 'application/json'},
                        'body': JSON.stringify({address: address})
                    };
                    return fetch('/api/v1/gettrainstation',getTrainstation);
                } else {
                    dispatch({
                        type: ADD_START_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode > 0) {
                    const addTrainStop = {
                        'method': 'POST',
                        'headers': {'Content-Type': 'application/json'},
                        'body': JSON.stringify({
                            type: 'customer',
                            params: Object.assign({tasktoken: taskToken},{customernumber: json.customernumber})
                        })
                    };
                    return fetch('/api/v1/addstop',addTrainStop);
                } else {
                    dispatch({
                        type: ADD_START_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode >0) {
                    dispatch({
                        type: ADD_START_STOPADDED,
                        payload: json.stop
                    });
                    dispatch({
                        type: ADD_START_SUCCESS,
                        payload: true
                    });
                } else {
                    dispatch({
                        type: ADD_START_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .catch(error => dispatch({
                type: ADD_START_ERROR,
                payload: {err: 'fetchError',data:error}
            }));
        
    }
}


export function addEndAddress(taskToken,address) {
    return(dispatch) => {
        dispatch({type:ADD_END_START,payload:null});
        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
                type: 'address',
                params: Object.assign({tasktoken: taskToken}, address)
            })
        };

        const getTrainstation = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({address: address})
        };

        return fetch('/api/v1/gettrainstation',getTrainstation)
            .then(data => data.json())
            .then(json => {
                if(json.statuscode > 0) {
                    const addTrainStop = {
                        'method': 'POST',
                        'headers': {'Content-Type': 'application/json'},
                        'body': JSON.stringify({
                            type: 'customer',
                            params: Object.assign({tasktoken: taskToken},{customernumber: json.customernumber})
                        })
                    };
                    return fetch('/api/v1/addstop',addTrainStop);
                } else {
                    dispatch({
                        type: ADD_END_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode > 0) {
                    dispatch({
                        type: ADD_END_STOPADDED,
                        payload: json.stop
                    });
                    const addEndStop = {
                        'method': 'POST',
                        'headers': {'Content-Type': 'application/json'},
                        'body': JSON.stringify({
                            type: 'address',
                            params: Object.assign({tasktoken: taskToken}, address)
                        })
                    };
                    return fetch('/api/v1/addstop',addEndStop);
                } else {
                    dispatch({
                        type: ADD_END_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .then(data => data.json())
            .then(json => {
                if(json.statuscode >0) {
                    dispatch({
                        type: ADD_END_STOPADDED,
                        payload: json.stop
                    });
                    dispatch({
                        type: ADD_END_SUCCESS,
                        payload: true
                    });
                } else {
                    dispatch({
                        type: ADD_END_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .catch(error => dispatch({
                type: ADD_END_ERROR,
                payload: {err: 'fetchError',data:error}
            }));

    }
}

export function getStopList(taskToken) {
    return(dispatch) => {
        dispatch({type:GET_STOPLIST_START,payload:null});

        const opt = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({tasktoken: taskToken})
        };
        return fetch('/api/v1/addaddress',opt)
            .then(data => data.json())
            .then(json => {
                if(json.statuscode > 0) {
                    dispatch({
                        type: GET_STOPLIST_SUCCESS,
                        payload: json
                    });
                } else {
                    dispatch({
                        type: GET_STOPLIST_ERROR,
                        payload: {err: 'apiError',data:json}
                    });
                }
            })
            .catch(error => dispatch({
                type: GET_STOPLIST_ERROR,
                payload: {err: 'fetchError',data:error}
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
