const express = require('express');
const request = require('request');
const JsSHA = require('jssha');
const CONFIG = require('./config');

// create new API router;
const apiRouter = express.Router();

function createLoboRequest(action,params = {}) {
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

apiRouter.get('/productlist', function (req,res, next) {
    const opt = createLoboRequest('getProductList');
    request.post(opt, function (err,response,body) {
        if(err) {
            res.json({error:err});
        } else {
            res.send(body);
        }
    });
});

apiRouter.get('/verifyAdress',function (req,res, next) {
    const params = {
        isocode: 'CHE',
        zip: '8004',
        street: 'Stauffacherstrasse',
        housenumber: 223
    };
    const opt = createLoboRequest('verifyAddress',params);
    console.log(opt);
    request.post(opt, function (err,response,body) {
        if(err) {
            res.json({error:err});
        } else {
            res.send(body);
        }
    });
});

module.exports = apiRouter;