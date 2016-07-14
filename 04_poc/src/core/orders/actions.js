import {
    GET_PRODUCTID_START,
    GET_PRODUCTID_ERROR,
    GET_PRODUCTID_SUCCESS,
    GET_PAYMENTID_START,
    GET_PAYMENTID_ERROR,
    GET_PAYMENTID_SUCCESS,
    GET_CONNECTIONS_START,
    GET_CONNECTIONS_ERROR,
    GET_CONNECTIONS_SUCCESS,
    CREATE_ORDER_START,
    CREATE_ORDER_ERROR,
    CREATE_ORDER_SUCCESS,
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
    UPDATE_TASKINFO_START,
    UPDATE_TASKINFO_ERROR,
    UPDATE_TASKINFO_SUCCESS,
    UPDATE_STOPTIME_START,
    UPDATE_STOPTIME_ERROR,
    UPDATE_STOPTIME_SUCCESS,
    ORDER_TASK_START,
    ORDER_TASK_ERROR,
    ORDER_TASK_SUCCESS,
    DELETE_TASK
} from './action-types';

import { CUSTOMBER_NUMBER } from '../../config';

export function getProductId() {
  return dispatch => {
    dispatch({type: GET_PRODUCTID_START, payload: null});
    return fetch('/api/v1/productList')
            .then(data => data.json())
            .then(json => dispatch({
              type: GET_PRODUCTID_SUCCESS,
              payload: json
            }))
            .catch(error => dispatch({
              type: GET_PRODUCTID_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}

export function getPaymentId() {
  return dispatch => {
    dispatch({type: GET_PAYMENTID_START, payload: null});
    return fetch('/api/v1/paymentlist')
            .then(data => data.json())
            .then(json => dispatch({
              type: GET_PAYMENTID_SUCCESS,
              payload: json
            }))
            .catch(error => dispatch({
              type: GET_PAYMENTID_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}

export function getConnections(from,to,date,pickup) {
  return dispatch => {
    dispatch({type: GET_CONNECTIONS_START, payload: null});
    const connections = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({from, to, date, pickup})
    };
    return fetch('/api/v1/connections',connections)
      .then(data => data.json())
      .then(json => {
        dispatch({
          type: GET_CONNECTIONS_SUCCESS,
          payload: json
        });
      })
      .catch(error => {
        dispatch({
          type: GET_CONNECTIONS_ERROR,
          payload: error
        })
      });
  }
}

export function createTask(productId, paymentId, datetime) {
  return dispatch => {
    dispatch({type: CREATE_ORDER_START, payload: null});
    const opt = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({productid: productId, paymentid: paymentId, reftime: datetime, customernumber: CUSTOMBER_NUMBER})
    };
    return fetch('/api/v1/createtask', opt)
            .then(data => data.json())
            .then(json => {
              if (json.statuscode === 1) {
                dispatch({
                  type: CREATE_ORDER_SUCCESS,
                  payload: {
                    tasktoken: json.tasktoken,
                    productid: productId,
                    paymentid: paymentId,
                    reftime: datetime
                  }
                });
              } else {
                dispatch({
                  type: CREATE_ORDER_ERROR,
                  payload: {err: 'apiError', data: json}
                });
              }
            })
            .catch(error => dispatch({
              type: CREATE_ORDER_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}

export function addStop(tasktoken, address) {
  return dispatch => {
    dispatch({type: ADD_STOP_START, payload: null});
    const addStopPost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(Object.assign({tasktoken}, address))
    };
    return fetch('/api/v1/addstop', addStopPost)
            .then(data => data.json())
            .then(json => {
              if (json.statuscode > 0) {
                dispatch({
                  type: ADD_STOP_SUCCESS,
                  payload: json.stop
                });
              } else {
                dispatch({
                  type: ADD_STOP_ERROR,
                  payload: {err: 'apiError', data: json}
                });
              }
            })
            .catch(error => dispatch({
              type: ADD_STOP_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}

export function updateReftime(tasktoken, reftime) {
  return dispatch => {
    dispatch({type: UPDATE_REFTIME_START, payload: null});
    const reftimePost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({tasktoken, reftime})
    };
    return fetch('/api/v1/updatereftime', reftimePost)
      .then(data => data.json())
      .then(json => {
        dispatch({
          type: UPDATE_REFTIME_SUCCESS,
          payload: reftime
        });
      })
      .catch(error => dispatch({
        type: UPDATE_REFTIME_ERROR,
        payload: {err: 'fetchError', data: error}
      }));
  };
}

export function deleteTask() {
  return dispatch => {
    dispatch({type: DELETE_TASK});
  }
}

export function compileTask(tasktoken) {
  return dispatch => {
    dispatch({type: COMPILE_TASK_START, payload: null});

    const compileTaskPost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({tasktoken})
    };

    return fetch('/api/v1/compiletask', compileTaskPost)
            .then(data => data.json())
            .then(json => {
              if (json.task.statuscode > 0) {
                json.tasktoken = tasktoken;
                 return dispatch({
                  type: COMPILE_TASK_SUCCESS,
                  payload: json
                });
              } else {
                dispatch({
                  type: COMPILE_TASK_ERROR,
                  payload: json
                });
              }
            })
            .catch(error => dispatch({
              type: COMPILE_TASK_ERROR,
              payload: error
            }));
  };
}

export function calculateTask(tasktoken, reftime = 0) {
  return dispatch => {
    dispatch({type: CALCULATE_TASK_START, payload: null});

    const opt = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({tasktoken})
    };
    return fetch('/api/v1/calculatetask', opt)
            .then(data => data.json())
            .then(json => {
              if (json.task.statuscode > 0) {
                json.tasktoken = tasktoken;
                json.reftime = reftime;
                dispatch({
                  type: CALCULATE_TASK_SUCCESS,
                  payload: json
                });
              } else {
                dispatch({
                  type: CALCULATE_TASK_ERROR,
                  payload: {err: 'apiError', data: json}
                });
              }
            })
            .catch(error => dispatch({
              type: CALCULATE_TASK_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}


export function updateStopinfo(tasktoken, stopid, infos) {
  return dispatch => {
    dispatch({type: UPDATE_STOPINFO_START, payload: null});

    const stopinfoPost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(Object.assign({
        tasktoken: tasktoken,
        stopid: stopid
      }, infos))
    };
    return fetch('/api/v1/updatestopinfo', stopinfoPost)
            .then(data => data.json())
            .then(json => {
              if (json > 0) {
                dispatch({
                  type: UPDATE_STOPINFO_SUCCESS,
                  payload: json
                });
                return true;
              } else {
                dispatch({
                  type: UPDATE_STOPINFO_ERROR,
                  payload: {err: 'apiError', data: json}
                });
              }
            })
            .catch(error => dispatch({
              type: UPDATE_STOPINFO_ERROR,
              payload: {err: 'fetchError', data: error}
            }));
  };
}

export function updateTaskinfo(tasktoken, string) {
  return dispatch => {
    dispatch({type: UPDATE_TASKINFO_START, payload: null});

    const taskInfoPost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({
        tasktoken: tasktoken,
        notepublic: string
      })
    };
    return fetch('/api/v1/updatetaskinfo', taskInfoPost)
      .then(data => data.json())
      .then(json => {
        if (json > 0) {
          dispatch({
            type: UPDATE_TASKINFO_SUCCESS,
            payload: json
          });
          return true;
        } else {
          dispatch({
            type: UPDATE_TASKINFO_ERROR,
            payload: {err: 'apiError', data: json}
          });
        }
      })
      .catch(error => dispatch({
        type: UPDATE_TASKINFO_ERROR,
        payload: {err: 'fetchError', data: error}
      }));
  };
}

export function updateStoptime(tasktoken, stopid, times) {
  return dispatch => {
    dispatch({type: UPDATE_STOPTIME_START});

    const stoptimePost = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(Object.assign({
        tasktoken: tasktoken,
        stopid: stopid
      }, times))
    };
    return fetch('/api/v1/updatestoptime', stoptimePost)
      .then(data => {
        if(data.ok) {
          dispatch({type: UPDATE_STOPTIME_SUCCESS});
          return true;
        } else {
          throw 'Could not update stop times';
        }
      })
      .catch(error => dispatch({type:UPDATE_STOPINFO_ERROR,payload:error}));

  }
}

export function orderTask(tasktoken) {
  return dispatch => {
    dispatch({type: ORDER_TASK_START, payload: null});
    const orderTask = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({tasktoken})
    };

    return fetch('/api/v1/ordertask', orderTask)
            .then(data => data.json())
            .then(json => {
              if (json.statuscode > 0) {
                dispatch({
                  type: ORDER_TASK_SUCCESS,
                  payload: json
                });
              } else {
                dispatch({
                  type: ORDER_TASK_ERROR,
                  payload: {err: 'apiError', data: json}
                });
              }
            })
            .catch(error => dispatch({
              type: ORDER_TASK_ERROR,
              payload: {err: 'fetchError', data: error}
            }));


  };
}
