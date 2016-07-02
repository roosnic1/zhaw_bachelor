const express = require('express');
const request = require('request');
const rp = require('request-promise');
const JsSHA = require('jssha');
const Vec2 = require('vec2');
const CONFIG = require('./config');
const POLY = require('./polygons');

// create new API router;
const apiRouter = express.Router();

function createLoboRequest(action,params = {}) {
    for(key in params) {
        params[key] = String(params[key]);
    }
    const postArray  = Object.assign({
        action: action,
        clientIp: '127.0.0.1',
        responseFormat: 'json'
    },params);

    const shaObj = new JsSHA('SHA-256', "TEXT");
    shaObj.setHMACKey(CONFIG.LOBO_API_PRIVATE_KEY, "TEXT");
    shaObj.update(JSON.stringify(postArray));

    return {
        url: CONFIG.LOBO_API_URL,
        method: 'POST',
        headers: {
            'X-Client-Id': CONFIG.LOBO_API_CLIENT_ID,
            'X-Public-Hash': shaObj.getHMAC("HEX"),
        },
        form: postArray
    };
}

let getGrantedActions = new Promise(function (resolve,reject) {
    const opt = createLoboRequest('getGrantedActions');
    request.post(opt, function (err,response,body) {
        if(err) {
            reject(err);
        }else {
            resolve(body);
        }
    });
});




apiRouter.connectToLobo = function () {
    "use strict";
    getGrantedActions.then(function (data) {
        console.log(data);
    }, function (err) {
        console.error('Error:',err);
    });
};

//apiRouter.route('/check')

apiRouter.get('/productlist', function (req,res) {
    const opt = createLoboRequest('getProductList');
    request.post(opt, function (err,response,body) {
        if(err) {
            res.json({error:err});
        } else {
            res.send(body);
        }
    });
});

apiRouter.get('/paymentlist', function (req,res) {
    const opt = createLoboRequest('getPaymentList');
    request.post(opt, function (err,response,body) {
        if(err) {
            res.json({error:err});
        } else {
            res.send(body);
        }
    });
});

apiRouter.post('/createtask', function (req,res) {
    // TODO: validate incoming data

    /*if(!req.body.reftime) {
        req.body.reftime = new Date().getTime();
    }*/

    const opt = createLoboRequest('createTask',req.body);
    console.log(opt,req.body.reftime);
    request.post(opt, function (err,response,body) {
        if(err || response.statusCode === 403) {
            res.json({error:err,statusCode:response.statusCode});
        } else {
            res.send(body);
        }
    });
});

apiRouter.post('/gettrainstation', function (req,res) {
    // TODO: check if lat/long point is inside polygon -> Google Maps and return placeID
    let point = new Vec2(req.body.address.coord);
    let zone = POLY.find(function (poly) {
        return poly.poly.containsPoint(point);
    });
    if(zone) {
        res.json({statuscode: 1,customernumber:zone.customernumber});
    } else {
        res.json({error:'zone not found',coords:req.body.address.coord});
    }
});

apiRouter.post('/addstop', function (req,res) {
    let request;
    if(req.body.type === 'customer') {
        request = createLoboRequest('addStopByCustomerNumber',req.body.params);
    } else {
        request = createLoboRequest('addStop',req.body.params);
    }
    rp(request)
        .then(function (json) {
            const data = JSON.parse(json);
            if(data.statuscode > 0) {
                res.send(json);
            } else {
                console.log(request);
                data.params = req.body.params;
                data.errm = 'could not add stop';
                res.json(data);
            }
        })
        .catch(function (err) {
            console.error('ERROR',err);
            res.status(500).send('API Request failed');
        });
});

apiRouter.post('/getstoplist', function (req,res) {
    rp(createLoboRequest('getStopList',req.body))
        .then(function (json) {
            res.send(json);
        });
});

apiRouter.post('/verifyaddress',function (req,res) {
    // TODO: validate incoming data
    
    var tasktoken = '';
    rp(createLoboRequest('createTask',Object.assign({},req.body.ids,{customernumber: 200032})))
        .then(function (json) {
            const data = JSON.parse(json);
            if(data.statuscode === 1) {
                tasktoken = data.tasktoken;
                return rp(createLoboRequest('addStop', Object.assign({}, {tasktoken: tasktoken}, req.body.address)));
            }
        })
        .then(function (json) {
            const data = JSON.parse(json);
            if(data.statuscode > 0) {
                return rp(createLoboRequest('calculateTask',{tasktoken: tasktoken}));
            }
        })
        .then(function (json) {
            const data = JSON.parse(json);
            if(data.statuscode !== -3 && data.statuscode !== -1) {
                res.json({valid: true, message: ''});
            } else if(data.statuscode === -3) {
                res.json({valid: false, message: 'not covered by supplyarea'});
            } else {
                res.json({valid: false, message: 'not a valid address'});
            }
        })
        .catch(function (err) {
            console.error('ERROR',err);
            res.status(500).send('API Request failed');
        });
});

apiRouter.post('/calculatetask', function (req,res) {
    // TODO: validate incoming data
    rp(createLoboRequest('calculateTask',{tasktoken: req.body.tasktoken}))
        .then(function (json) {
            const data = JSON.parse(json);
            if(data.statuscode > 0) {
                res.send(json);
            } else {
                res.json({error: 'could not calculate task', data: data});
            }
        })
        .catch(function(err) {
            console.error('ERROR',err);
            res.status(500).send('API Request failed');
        })
});


apiRouter.post('/updatestopinfo', function (req,res) {
    // TODO: validate incoming data
    rp(createLoboRequest('setStopInfo',req.body))
        .then(function (json) {
            const data = JSON.parse(json);
            if(data > 0) {
                res.send(json);
            } else {
                res.json({error: 'could not add stop info', data: data});
            }
        })
        .catch(function(err) {
            console.error('ERROR',err);
            res.status(500).send('API Request failed');
        })
});

module.exports = apiRouter;