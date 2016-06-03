import express from 'express';
import request from 'request';
import * as CONFIG from './config';
var app = express();



app.get('/api', function (req, res) {
    //request.post(CONFIG.LOBO_API_URL)

    console.log('Executing API call');
    res.json({test: 'test'});
    //res.sendStatus(200);
});

app.use('/', express.static(__dirname + '/app'));


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});