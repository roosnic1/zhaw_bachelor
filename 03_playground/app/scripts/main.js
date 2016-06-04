

let postArray  = {};
postArray['action'] = 'getProductList';
postArray['clientIp'] = '127.0.0.1';
postArray['responseFormat'] = 'json';




var myInit = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postArray)
};

fetch('/api',myInit).then(function (data) {
    return data.json();
}).then(function (json) {
    console.log(json);
});

