
import {
    GET_PRODUCTID_SUCCESS,
    GET_PRODUCTID_ERROR
} from './action-types';


export const initialState = {
    list: []
};


export function ordersReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PRODUCTID_SUCCESS:
            return {
                list: (action.payload && action.payload.length > 0) ?
                    [ ...action.payload ] :
                    [ ...state.list ]
            };
        case GET_PRODUCTID_ERROR:
            console.error(action.payload);
            return state;
        /*case DELETE_TASK_SUCCESS:
            return {
                deleted: action.payload,
                list: state.list.filter(task => {
                    return task.key !== action.payload.key;
                }),
                previous: [ ...state.list ]
            };

        case UPDATE_TASK_SUCCESS:
            return {
                deleted: null,
                list: state.list.map(task => {
                    return task.key === action.payload.key ? action.payload : task;
                }),
                previous: []
            };

        case SIGN_OUT_SUCCESS:
            return {
                deleted: null,
                list: [],
                previous: []
            };*/

        default:
            return state;
    }
}
