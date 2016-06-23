const express = require('express');
const request = require('request');
const rp = require('request-promise');
const JsSHA = require('jssha');
const CONFIG = require('./config');

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
    if(!req.body.productid) {
        res.json({error:'no product id'});
    }
    req.body.reftime = new Date().getTime();
    const opt = createLoboRequest('createTask',req.body);
    request.post(opt, function (err,response,body) {
        if(err || response.statusCode === 403) {
            res.json({error:err,statusCode:response.statusCode});
        } else {
            res.send(body);
        }
    });
});

apiRouter.post('/verifyaddress',function (req,res) {
    var tasktoken = '';
    rp(createLoboRequest('createTask',Object.assign({},req.body.ids,{customernumber: 200025})))
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
            console.log(data);
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

module.exports = apiRouter;