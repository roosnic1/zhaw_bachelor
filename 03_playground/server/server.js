import express from 'express';
import request from 'request';
import jsSHA from 'jssha';
import bodyParser from 'body-parser';
import * as CONFIG from './config';
var app = express();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api', function (req, res) {
    if(!req.body) {
        res.json({error: 'No Data in request'});
    }

    let postArray = req.body;

    let shaObj = new jsSHA('SHA-256', "TEXT");
    shaObj.setHMACKey(CONFIG.LOBO_API_PRIVATE_KEY, "TEXT");
    shaObj.update(JSON.stringify(postArray));


    let opt = {
        url: CONFIG.LOBO_API_URL_SANDBOX,
        method: 'POST',
        headers: {
            'X-Client-Id': CONFIG.LOBO_API_CLIENT_ID,
            'X-Public-Hash': shaObj.getHMAC("HEX"),
        },
        form: postArray
    };
    request.post(opt, function (err,response,body) {
        if(err) {
            console.log('ERROR: ',err);
            res.json({error:err});
            return;
        }

        console.log(body);
        res.json(body);
    });
});

app.use('/', express.static(__dirname + '/app'));


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});