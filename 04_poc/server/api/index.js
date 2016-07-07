/* eslint no-console: 0 */

const express = require('express');
const request = require('request');
const rp = require('request-promise');
const JsSHA = require('jssha');
const Vec2 = require('vec2');
const CONFIG = require('./config');
const POLY = require('./polygons');
const querystring = require('querystring');
const moment = require('moment');

// create new API router;
const apiRouter = new express.Router();

function createLoboRequest(action, params = {}) {
  for (let key in params) {
    if ({}.hasOwnProperty.call(params, key)) {
      params[key] = String(params[key]);
    }
  }
  const postArray = Object.assign({
    action: action,
    clientIp: '127.0.0.1',
    responseFormat: 'json'
  }, params);

  const shaObj = new JsSHA('SHA-256', 'TEXT');
  shaObj.setHMACKey(CONFIG.LOBO_API_PRIVATE_KEY, 'TEXT');
  shaObj.update(JSON.stringify(postArray));

  return {
    url: CONFIG.LOBO_API_URL,
    method: 'POST',
    headers: {
      'X-Client-Id': CONFIG.LOBO_API_CLIENT_ID,
      'X-Public-Hash': shaObj.getHMAC('HEX')
    },
    form: postArray
  };
}

let getGrantedActions = new Promise(function(resolve, reject) {
  const opt = createLoboRequest('getGrantedActions');
  request.post(opt, function(err, response, body) {
    if (err) {
      reject(err);
    } else {
      resolve(body);
    }
  });
});

function getTrainStation(coord) {
  let point = new Vec2(coord);
  return POLY.find(function(poly) {
    return poly.poly.containsPoint(point);
  });

}

function ApiException(message, data) {
  this.message = message;
  this.data = data;
  this.name = 'ApiException';
}


apiRouter.connectToLobo = function() {
  'use strict';
  getGrantedActions.then(function(data) {
    console.log(data);
  }, function(err) {
    console.error('Error:', err);
  });
};

// apiRouter.route('/check')

apiRouter.get('/productlist', function(req, res) {
  const opt = createLoboRequest('getProductList');
  request.post(opt, function(err, response, body) {
    if (err) {
      res.json({error: err});
    } else {
      res.send(body);
    }
  });
});

apiRouter.get('/paymentlist', function(req, res) {
  const opt = createLoboRequest('getPaymentList');
  request.post(opt, function(err, response, body) {
    if (err) {
      res.json({error: err});
    } else {
      res.send(body);
    }
  });
});

apiRouter.post('/createtask', function(req, res) {
    // TODO: validate incoming data
  const params = Object.assign({},req.body,{reftime: Math.floor(req.body.reftime / 1000)});
  request.post(createLoboRequest('createTask', params), function(err, response, body) {
    if (err || response.statusCode === 403) {
      res.json({error: err, statusCode: response.statusCode});
    } else {
      res.send(body);
    }
  });
});

apiRouter.post('/addstop', function(req, res) {
    // TODO: validate incoming data
  rp(createLoboRequest('addStop', req.body))
        .then(function(json) {
          const data = JSON.parse(json);
          if (data.statuscode > 0) {
            res.send(json);
          } else {
            console.log(request);
            data.params = req.body;
            data.errm = 'could not add stop';
            res.json(data);
          }
        })
        .catch(function(err) {
          console.error('ERROR', err);
          res.status(500).send('API Request failed');
        });
});

apiRouter.post('/getstoplist', function(req, res) {
  rp(createLoboRequest('getStopList', req.body))
        .then(function(json) {
          res.send(json);
        })
        .catch(function(err) {
          console.error('ERROR', err);
          res.status(500).send('API Request failed');
        });
});

apiRouter.post('/verifyaddress', function(req, res) {
    // TODO: validate incoming data

  var tasktoken = '';
  rp(createLoboRequest('createTask', Object.assign({}, req.body.ids, {customernumber: 200032})))
        .then(function(json) {
          const data = JSON.parse(json);
          if (data.statuscode === 1) {
            tasktoken = data.tasktoken;
            return rp(createLoboRequest('addStop', Object.assign({}, {tasktoken: tasktoken}, req.body.address)));
          }
        })
        .then(function(json) {
          const data = JSON.parse(json);
          if (data.statuscode > 0) {
            return rp(createLoboRequest('calculateTask', {tasktoken: tasktoken}));
          }
        })
        .then(function(json) {
          const data = JSON.parse(json);
          if (data.statuscode !== -3 && data.statuscode !== -1) {
            res.json({valid: true, message: ''});
          } else if (data.statuscode === -3) {
            res.json({valid: false, message: 'not covered by supplyarea'});
          } else {
            res.json({valid: false, message: 'not a valid address'});
          }
        })
        .catch(function(err) {
          console.error('ERROR', err);
          res.status(500).send('API Request failed');
        });
});

apiRouter.post('/compiletask', function(req, res) {
    // TODO: validate incoming data
  const stopSequence = [];
  let stops = [];

  rp(createLoboRequest('getStopList', { tasktoken: req.body.tasktoken }))
    .then(function(json) {
      stops = JSON.parse(json);
      if (stops.length > 0) {
            // First Stop
        stopSequence.push(stops[0].id);
        const params = querystring.stringify({
          address: stops[0].street + '+' + stops[0].housenumber + ',' + stops[0].city + ',' + stops[0].isocode,
          key: CONFIG.GOOGLE_MAPS_KEY
        });
        return rp(JSON.parse( JSON.stringify( 'https://maps.googleapis.com/maps/api/geocode/json?' + params )));
      } else {
        throw new ApiException('Could not get stopList', req.body.tasktoken);
      }

    })
    .then(function(json) {
      const latAndLng = JSON.parse(json);
      const zone = getTrainStation([
        latAndLng.results[0].geometry.location.lat,
        latAndLng.results[0].geometry.location.lng
      ]);
      if (zone !== undefined) {
        return rp(createLoboRequest('addStopByCustomerNumber', {tasktoken: req.body.tasktoken, customernumber: zone.customernumber}));
      } else {
        throw new ApiException('Could not get zone', {zone: zone, latAndLng: latAndLng});
      }

    })
    .then(function(json) {
      const stop = JSON.parse(json);
      if (stop.statuscode > 0) {
        stopSequence.push(stop.stop.id);

        const params = querystring.stringify({
          address: stops[1].street + '+' + stops[1].housenumber + ',' + stops[1].city + ',' + stops[1].isocode,
          key: CONFIG.GOOGLE_MAPS_KEY
        });
        return rp(JSON.parse( JSON.stringify( 'https://maps.googleapis.com/maps/api/geocode/json?' + params )));
      } else {
        throw new ApiException('Could not add stop', stop);
      }
    })
    .then(function(json) {
      const latAndLng = JSON.parse(json);
      const zone = getTrainStation([
        latAndLng.results[0].geometry.location.lat,
        latAndLng.results[0].geometry.location.lng
      ]);
      if (zone !== undefined) {
        return rp(createLoboRequest('addStopByCustomerNumber', {tasktoken: req.body.tasktoken, customernumber: zone.customernumber}));
      } else {
        throw new ApiException('Could not get zone', {zone: zone, latAndLng: latAndLng});
      }
    })
    .then(function(json) {
      const stop = JSON.parse(json);
      if (stop.statuscode > 0) {
        stopSequence.push(stop.stop.id);
        stopSequence.push(stops[1].id);
        return rp(createLoboRequest('setStopSequence', {tasktoken: req.body.tasktoken, sequence: stopSequence.join()}));
      } else {
        throw new ApiException('Could not add stop', stop);
      }
    })
    .then(function(json) {
      const statuscode = JSON.parse(json);
      if (statuscode > 0) {
        return rp(createLoboRequest('getStopList', {tasktoken: req.body.tasktoken}));
      } else {
        throw new ApiException('Could not update stoplist sequence', statuscode);
      }
    })
    .then(function(json) {
      stops = JSON.parse(json);
      if (stops.length > 0) {

        return rp(createLoboRequest('calculateTask', {tasktoken: req.body.tasktoken}));
      } else {
        throw new ApiException('Could not get stoplist', req.body.tasktoken);
      }
    })
    .then(function(json) {
      const task = JSON.parse(json);
      if (task.statuscode > 0) {
        res.send({
          task: task,
          stops: stops
        });
      } else {
        throw new ApiException('Could not calculate task', task);
      }
    })
    .catch(function(err) {
      console.error('ERROR', err);
      res.status(500).json(err);
    });
});

apiRouter.post('/calculatetask', function(req, res) {
    // TODO: validate incoming data
  let aTask = null;

  rp(createLoboRequest('calculateTask', {tasktoken: req.body.tasktoken}))
        .then(function(json) {
          const task = JSON.parse(json);
          if (task.statuscode > 0) {
            aTask = task;
            return rp(createLoboRequest('getStopList', {tasktoken: req.body.tasktoken}));
          } else {
            throw new ApiException('Could not calculate task', task);
          }
        })
        .then(function(json) {
          const stops = JSON.parse(json);
          if (stops.length > 0) {
            res.json({task: aTask, stops: stops});
          } else {
            throw new ApiException('Could not get stopList', req.body.tasktoken);
          }
        })
        .catch(function(error) {
          console.error('ERROR', error);
          res.json(error);
        });
});


apiRouter.post('/updatestopinfo', function(req, res) {
    // TODO: validate incoming data
  rp(createLoboRequest('setStopInfo', req.body))
        .then(function(json) {
          const data = JSON.parse(json);
          if (data > 0) {
            res.send(json);
          } else {
            res.json({error: 'could not add stop info', data: data});
          }
        })
        .catch(function(err) {
          console.error('ERROR', err);
          res.status(500).send('API Request failed');
        });
});

apiRouter.post('/updatereftime', function(req, res) {
  // TODO: validate incoming
  const params = Object.assign({},req.body,{reftime: Math.floor(req.body.reftime / 1000)});
  rp(createLoboRequest('setRefTime', params))
    .then(function(json) {
      const data = JSON.parse(json);
      console.log(data);
      if (data > 0) {
        res.send(json);
      } else {
        console.error('ERROR while updating reftime',data);
        res.status(500).send('could not update reftime info');
      }
    })
    .catch(function(err) {
      console.error('ERROR', err);
      res.status(500).send('API Request failed');
    });
});

apiRouter.post('/ordertask', function(req, res) {
    // TODO: validate incoming data
  rp(createLoboRequest('orderTask', req.body))
        .then(function(json) {
          const data = JSON.parse(json);
          if (data.statuscode > 0) {
            res.send(json);
          } else {
            res.json({error: 'could not order task', data: data});
          }
        })
        .catch(function(err) {
          console.error('ERROR', err);
          res.status(500).send('API Request failed');
        });
});


apiRouter.post('/connections', function (req, res) {
  const params = querystring.stringify({
    from: req.body.from,
    to: req.body.to,
    date: moment(req.body.date).format('YYYY-MM-DD'),
    time: moment(req.body.date).add(req.body.pickup,'minutes').format('hh:mm')
  });
  const request = 'https://transport.opendata.ch/v1/connections?'+params;
  console.log(request);
  rp(request)
    .then(function (json) {
      console.log(json);
      const data = JSON.parse(json);
      if(data.connections.length > 0) {
        //res.send(json);
        res.json(data.connections);
      } else {
        res.status(500).send('No connections found');
      }

    })
    .catch(function (error) {
      console.error('Error',error);
      res.status(500).send('API Request failed');
    });
});

module.exports = apiRouter;
