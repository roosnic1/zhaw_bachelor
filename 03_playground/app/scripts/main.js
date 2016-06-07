import * as CONFIG from './config';

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



let map;
window.initMap = function() {
    let styledMap = new google.maps.StyledMapType(CONFIG.GOOGLE_MAP_STYLE,{name: "Styled Map"});

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.379011, lng: 8.5076487},
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
};
