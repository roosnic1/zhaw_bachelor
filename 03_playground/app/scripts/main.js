import * as CONFIG from './config';
import jsSHA from 'jssha';


let postArray  = {};
postArray['action'] = 'getProductList';
postArray['clientIp'] = '127.0.0.1';
postArray['responseFormat'] = 'json';



let shaObj = new jsSHA('SHA-256', 'TEXT');
shaObj.setHMACKey(CONFIG.LOBO_API_PRIVATE_KEY, 'TEXT');
shaObj.update(JSON.stringify(postArray));
let publicHash = shaObj.getHMAC("HEX");

var myHeaders = new Headers();
myHeaders.set("Content-Type", "application/json");
myHeaders.set('Accept','application/json, application/xml, text/plain, text/html, *.*');
myHeaders.set('X-Client-Id',CONFIG.LOBO_API_CLIENT_ID);
myHeaders.set('X-Public-Hash',publicHash);

let formData = new URLSearchParams();
for(let key in postArray) {
    console.log(key,postArray[key]);
    formData.append(key,postArray[key]);
}

var myInit = {
    method: 'POST',
    headers: myHeaders,
    mode: 'no-cors',
    body: formData
};



console.log(myInit);

console.log(myHeaders.getAll('X-Public-Hash'));
console.log(myHeaders.getAll('X-Client-Id'));

fetch(CONFIG.LOBO_API_URL,myInit).then(function (data) {
    console.log(data.json());
    //return data.json();
}).then(function (json) {
    console.log(json);
});

