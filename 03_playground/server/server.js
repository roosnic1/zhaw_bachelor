var express = require('express');
var app = express();



app.get('/api', function (req, res) {
    console.log('Executing API call');
});

app.use('/', express.static(__dirname + '/app'));


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});