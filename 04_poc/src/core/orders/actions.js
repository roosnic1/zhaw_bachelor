import {
    GET_PRODUCTID_ERROR,
    GET_PRODUCTID_SUCCESS,
    CREATE_ORDER_ERROR,
    CREATE_ORDER_SUCCESS,
    ADD_STOP_ERROR,
    ADD_STOP_SUCCESS,
    UPDATE_ORDER_ERROR,
    UPDATE_ORDER_SUCCESS
} from './action-types';

export function getProductId() {
    return(dispatch) => {
        fetch('/api/v1/productList')
            .then(data => data.json())
            .then(json => dispatch({
                type: GET_PRODUCTID_SUCCESS,
                payload: json
            }))
            .catch(error => dispatch({
                type: GET_PRODUCTID_ERROR,
                payload: error
            }))
    };
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
