

let postArray  = {};
postArray['action'] = 'getProductList';
//postArray['clientIp'] = '127.0.0.1';
postArray['responseFormat'] = 'json';



var myHeaders = new Headers();
myHeaders.set("Content-Type", "application/json");
myHeaders.set('Accept','application/json, text/plain, text/html');
//myHeaders.set('X-Client-Id',CONFIG.LOBO_API_CLIENT_ID);
//myHeaders.set('X-Public-Hash',publicHash);

/*let formData = new URLSearchParams();
for(let key in postArray) {
    console.log(key,postArray[key]);
    formData.append(key,postArray[key]);
}*/

var myInit = {
    method: 'GET',
    //headers: myHeaders,
    body: postArray
};

fetch('/api',myInit).then(function (data) {
    return data.json();
}).then(function (json) {
    console.log(json);
});

