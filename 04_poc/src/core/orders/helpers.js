

// Getting an address object from Google Maps Place for LoBo.
export function getAddressFromGoogleMapAutoComplete(place,input) {
    if(!place || !place.address_components) {
        return {};
    }
    const address = {};
    place.address_components.map((comp) => {
        switch(comp.types[0]) {
            case 'street_number':
                if(isNaN(comp.long_name)) {
                    address['housenumber'] = input.value.match(/\d+/)[0];
                } else{
                    address['housenumber'] = comp.long_name;
                }
                break;
            case 'route':
                address['street'] = comp.long_name;
                break;
            case 'postal_code':
                address['zip'] = comp.long_name;
                break;
            case 'country':
                switch(comp.short_name) {
                    case 'DE':
                        address['isocode'] = 'DEU';
                        break;
                    case 'CH':
                        address['isocode'] = 'CHE';
                        break;
                    case 'AT':
                        address['isocode'] = 'AUT';
                        break;
                }
                break;
        }
    });
    return address;
}