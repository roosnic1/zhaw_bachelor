<?php


/*

-----------
 SETTINGS
-----------

*/

// Be sure to have the following constants defined:


// Alternatively you could define these constants in a sperate file:
require_once(__DIR__ . '/keyStore.php');




/*

-----------
  GENERAL
-----------

  Installation:
    copy loboApiCurl.php to your webserver
    define settings: LOBO_API_URL, LOBO_API_CLIENT_ID, LOBO_API_PRIVATE_KEY

  Dependency:
    CURL needs to be installed on your webserver

  Examples:
    exampleForm.php
    examplePhp.php


  NOTICE:
    Do not expose the settings (LOBO_API_URL, LOBO_API_CLIENT_ID, LOBO_API_PRIVATE_KEY) to the public,
    for example by directly accessing the API via cross-domain AJAX requests (JSONP) or unencrypted transfer protocols (http).

    Recommended request method is: POST! If you use the GET method the querystring must be uri compatible encoded.
    (if uri compatible encoding is not achieved automatically, try PHP rawurlencode() or JavaScript encodeURIComponent())

    It is highly recommended to restrict the access of the provided actions to registered users. Otherwise the API opens
    the access to sensitive data or fee based queries to the public.

    If you open (parts of) the API to the public assure to protect the API against access from bots and/or DoS attacks (e.g. by a CAPTCHA service).

    On violation of these terms you will be made liable for any loss or damage!




      -----------------
        DOCUMENTATION
      -----------------


 - all requests must be UTF-8 encoded!
     => html: <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
     => php: header('Content-Type: text/html; charset=utf-8');

---------------------------
 global request parameters
---------------------------
  action          ... required [ getProductList | getStatistics | autoCompleteStreet | ...
  responseFormat  ... optional [ json | base64_serialized | debug ],  default: json


  NOTICE: some ressources might be restriced depending on your license key.
          This includes the values for the paramters:
            - action
            - productid
            - customernumber

          In case you a query is not coverd by your license key your will receive an explanatory error message.
          You might want to call action='getGrantedActions' for further details.




-------------------------------------
 action specific parameters/response
-------------------------------------

  action='getGrantedActions'
  ------------------

    Description:
      returns an array of actions covered by your license key.

    params: none

    response:
        array of allowed actions



  action='getProductList'
  ---------------------

    Description:
      Lists all publicly available products

    params: none

    response:
        empty if no result or on error!

        array of available products (x: 0..n)
          array[x]['productid']             ... id (needs to be passed for further requests, eg. action='createTask')
          array[x]['name']                  ... name of product
          array[x]['alias']                 ... alias (short form of the name)
          array[x]['costmethod']            ... defines the method of cost calculation:
                                                1 ... fixed price (manual input)
                                                2 ... [DEPRECATED]
                                                3 ... zone system based (crosstab)
                                                4 ... beeline based
                                                5 ... route based
          array[x]['pricescalecount']            ... number of available price scale graduations (e.g. weight classes), equals 0 if the product has no price scale
          array[x]['availabilitytime'][1]   ... availability time for Monday (comma seperated list, eg: 06:00-12:00,13:00-18:00)
                                  ... [2]   ... for Tuesday
                                  ... [.]   ...
                                  ... [7]   ... for Sunday


    example:
      loboApiCurl.php?action=getProductList
      loboApiCurl.php?action=getProductList&responseFormat=debug



  action='getPaymentList'
  ---------------------

    Description:
      Lists all available payment methods

    params: none

    response:
        empty if no result or on error!

        array of available payments (x: 0..n)
          array[x]['paymentid']             ... id (needs to be passed for further requests, eg. action='createTask')
          array[x]['name']                  ... name of the payment
          array[x]['alias']                 ... alias (short form of the name)
          array[x]['onaccount']             ... defines if the payment is on account (accounted via invoice)
                                                1 ... true (on account)
                                                0 ... false (cash/prepayment)




  action='getPriceScale'
  ---------------------

    Description:
      Get details of the price scale for the given product and list
      all graduations (array['graduation']).
      Note that there a 2 different type input for action='setPriceScaleQuantity':
        array['type'] == 1: The quantity can be set arbitrarily.
        array['type'] == 2: The quantity must equal one of the quantitybreaks provided in the array['graduation'].

    params:
        productid      ... required (as obtained by action='getProductList')

    response:
        empty if no result or on error!

          array['name']             ... name of the price scale
          array['unit']             ... unit of the payment (eg. 'kg')
          array['type']             ... type of quantity declaration (1: manual input of quantity, 2: selection list restricted to quantitybreaks)
          array['graduation'][x]    ... array of available price scale graduations (x: 0..n)
                             ...['quantitybreak']    ... quantity break of the graduation (eg.: 4.00)
                             ...['name']             ... name of the graduation (eg.: '4 kg')



  action='createTask'
  -------------

    Description:
      Creates an internal (yet hidden) task.
      The returned 'tasktoken' is a reference to access and change this task, eg. to add stops, set a new reference time, change the productid, ...

    params:
        productid      ... required (as obtained by action='getProductList')
        paymentid      ... required (as obtained by action='getPaymentList')
        customernumber ... required (might be restricted by your API key)
        reftime        ... optional: unix timestamp (measured in the number of seconds since the Unix Epoch: Januar 1 1970 00:00:00 GMT)
                                     default is now (actual time as unix timestamp)

    response:
          array['tasktoken']      ... hash token that uniquely identifies the task (empty on error)
                                      (required param for subsequent (task related) API calls)
          array['statuscode']  ... status code
                                     1  ... success
                                    -1  ... missing/invalid parameter
                                    -2  ... unknown productid
                                    -3  ... unknown paymentid
                                    -4  ... invalid reftime
                                   -99  ... undefined error



  action='setProductId'
  -------------

    Description:
      Change the product of the given task.
      Next, you might want to call action='calculateTask' to query the updated cost and transit times.

    params:
        tasktoken     ... required (as obtained by action='createTask')
        productid     ... required (as obtained by action='getProductList')

    response:
           1 ... success
          -1 ... missing/invalid parameter
         -99 ... undefined error



  action='setPaymentId'
  -------------

    Description:
      Change the payment for a given task (typically called just before action='orderTask')

    params:
        tasktoken     ... required (as obtained by action='createTask')
        paymentid     ... required (as obtained by action='getPaymentList')

    response:
          -1 ... missing/invalid parameter
           1 ... success



  action='setCustomerNumber'
  -------------

    Description:
      Change the customer of the given task. Please consider that the resulting costs will change
      if the newly assigned customer is associated with another discount system.
      Next, you might want to call action='calculateTask' to query the resulting cost.

    params:
        tasktoken       ... required (as obtained by action='createTask')
        customernumber  ... required (might be restricted by your API key)

    response:
          -1 ... missing/invalid parameter
          -2 ... customer number unkown
           1 ... success



  action='setPriceScaleQuantity'
  -------------

    Description:
      Set the quantity input of a given task for the graduated price scale of the product.
      This action can be only applied to products that have pricescalecount > 0 (see action='getProductList').
      Note that a valid input depends on the price scale type (see action='getPriceScale').
      The quantity will be classified according to the price scales and affects
      the total cost of the task accordingly. To remove an active price scale reset the quantity to 0.
      Next, you might want to call action='calculateTask' to query the resulting cost.

    params:
        tasktoken     ... required (as obtained by action='createTask')
        quantity      ... numeric

    response:
          -1 ... error (eg.: not numeric)
          -2 ... error (exceeds upper limit: type 1 price scale only)
          -3 ... error (does not match any quantitybreak: type 2 price scale only)
           1 ... success



  action='setRefTime'
  -------------

    Description:
      Change the reference time of the given task.
      Next, you might want to call action='calculateTask' to query the updated transit times
      and/or if the the product is still available at the new time.

    params:
        tasktoken     ... required (as obtained by action='createTask')
        reftime       ... required: unix timestamp (measured in the number of seconds since the Unix Epoch: Januar 1 1970 00:00:00 GMT)

    response:
          -1 ... error
           1 ... success




  action='addStop'
  ------------------

    Description:
      Verifies an address and, on success (statuscode > 0): adds the address as new stop to the given task

    params:
        tasktoken     ... required (as obtained by action='createTask')
        isocode       ... required (ISO 3166-1 alpha-3 country code, eg.: AUT, DEU, CHE, ...)
        zip           ... required (zip code, optional if city is given)
        city          ... required (city name, optional if zip is given)
        street        ... required (street name)
        housenumber   ... required (numeric housenumber, eg.: 24)
        addition      ... optional (housenumber appendix, eg.: B)

    response:
        array['stop']   ... array with stop details including (corrected) address
                  ...['stopid']           ... unique identifier of the stop
                  ...['code']             ... country code
                  ...['isocode']          ... corresponding isocode
                  ...['zip']              ... zip code (corresponding to corrected address)
                  ...['city']             ... city name
                  ...['street']           ... street name
                  ...['housenumber']      ... numeric housenumber (eg.: 24)
                  ...['addition']         ... appendix (eg.: B)

        array['statuscode']  ... status code of the verification
                                 2   ... corrected and added
                                 1   ... verified and added (exact match)
                                 0   ... not found
                                -1   ... error (invalid parameters)
                                -2   ... task not found (expired)


  action='verifyAddress'
  ------------------

    Description:
      Verifies an address. Returned placeid can be used

    params:
        isocode       ... required (ISO 3166-1 alpha-3 country code, eg.: AUT, DEU, CHE, ...)
        zip           ... required (zip code, optional if city is given)
        city          ... required (city name, optional if zip is given)
        street        ... required (street name)
        housenumber   ... required (numeric housenumber, eg.: 24)
        addition      ... optional (housenumber appendix, eg.: B)

    response:
        array['address']   ... array with address details including (corrected) address
                  ...['placeid']           ... unique identifier of the place
                  ...['street']           ... street name
                  ...['housenumber']      ... numeric housenumber (eg.: 24)
                  ...['addition']         ... appendix (eg.: B)
                  ...['zip']              ... zip code (corresponding to corrected address)
                  ...['city']             ... city name
                  ...['isocode']          ... corresponding isocode

        array['statuscode']  ... status code of the verification
                                 2   ... corrected
                                 1   ... verified (exact match)
                                 0   ... not found
                                -1   ... error (invalid parameters)



  action='addStopByPlaceId'
  ------------------

    Description:
      Add a place as stop based on the search with action='verifyAddress' or action='autoCompletePlaceAndStreet'

    params:
        tasktoken     ... required (as obtained by action='createTask')
        placeid       ... required (as obtained by action='getProductList')

    response:
        array['stop']   ... array with stop details including (corrected) address
                  ...['stopid']           ... unique identifier of the stop
                  ...['code']             ... country code
                  ...['isocode']          ... corresponding isocode
                  ...['zip']              ... zip code (corresponding to corrected address)
                  ...['city']             ... city name
                  ...['street']           ... street name
                  ...['housenumber']      ... numeric housenumber (eg.: 24)
                  ...['addition']         ... appendix (eg.: B)
                  ^^^ up to here same as in action='addStop' ^^^
                  ...['name']             ... name of place
                  ...['alias']            ... alias (short form of the name) -> equals name, if no alias exists
        array['statuscode']  ... status code of the verification
                                 1   ... verified and added
                                 0   ... not found
                                -1   ... error (invalid parameters)
                                -2   ... task not found (expired)


  action='addStopByCustomerNumber'
  ------------------

    Description:
      Add a customer as stop

    params:
        tasktoken        ... required (as obtained by action='createTask')
        customernumber   ... required (might be restricted by your API key)

    response:
        array['stop']   ... array with stop details including (corrected) address
                  ...['stopid']           ... unique identifier of the stop
                  ...['code']             ... country code
                  ...['isocode']          ... corresponding isocode
                  ...['zip']              ... zip code (corresponding to corrected address)
                  ...['city']             ... city name
                  ...['street']           ... street name
                  ...['housenumber']      ... numeric housenumber (eg.: 24)
                  ...['addition']         ... appendix (eg.: B)
                  ^^^ up to here same as in action='addStop' ^^^
                  ...['name']             ... name of place
                  ...['alias']            ... alias (short form of the name) -> equals name, if no alias exists
        array['statuscode']  ... status code of the verification
                                 1   ... verified and added
                                 0   ... not found
                                -1   ... error (invalid parameters)
                                -2   ... task not found (expired)



  action='deleteStop'
  -------------

    Description:
      Deletes the given stop from the given task

    params:
        tasktoken     ... required (as obtained by action='createTask')
        stopid        ... required (as obtained by action='addStop')

    response:
          -1 ... error
           1 ... success



  action='setStopSequence'
  -------------

    Description:
      Set a new sequence of the stops.
      Next, you might want to call action='calculateTask' to query the updated cost and transit times.

    params:
        tasktoken     ... of the existing, not yet optimized task (required)
        sequence      ... comma separated list of stopids (as obtained by action='getStopList', eg.: '23,27,31,25')

    response:
          -1 ... error (sequence was not changed)
           1 ... success



  action='getStopList'
  -------------

    Description:
      Returns the current stop list including address information

    params:
        tasktoken     ... required (as obtained by action='createTask')

    response:
        array of stop details (x: 0..n) in the current order (empty if no stops are present, resp. on error)
          array[x]['stopid']           ... unique identifier of the stop
               ...['code']             ... country code
               ...['isocode']          ... corresponding isocode
               ...['zip']              ... zip code (corresponding to corrected address)
               ...['city']             ... city name
               ...['street']           ... street name
               ...['housenumber']      ... numeric housenumber (eg.: 24)
               ...['addition']         ... appendix (eg.: B)
               ...['name']             ... name of place (empty if not added with action='addStopByPlaceId')
               ...['alias']            ... alias of place (empty if not added with action='addStopByPlaceId')



  action='calculateTask'
  -------------

    Description:
      Calculates the cost and transit time parameters.

    params:
        tasktoken     ... required (as obtained by action='createTask')

    response:
          array['statuscode']             ... see status codes below
          array['attribution']            ... html code (something like: ''Powered by <a href="http://www.lobo.at">lobo.at</a>, based on: &copy;<a href="http://www.yournavigation.org">yournavigation</a>, &copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                              MUST be displayed together with any other (piece of) information of this response!
          ---
          array['numberofstops']          ... number of recognized stops
          array['orderfee']               ... orderfee
          array['stopallowance']          ... stopallowance
          array['routecost']              ... route (distance) depended part or cost
          array['costtotal']              ... = array['allowance'] + array['routecost']
          array['costtotalincludingvat']  ... depending on vat rate
          array['co2saving']              ... savings in CO2 emissions [g/km]


          array['pickup_handlingtime']    ... in minutes (relative to reftime (in seconds!), as set in action='createTask' or with action='setRefTime')
          array['pickup_traveltime']      ... in minutes
          array['delivery_handlingtime']  ... in minutes
          array['delivery_traveltime']    ... in minutes

          --- EXAMPLE ---
              12:00                   12:10                   12:30  => pickup: 12:10 - 12:30
                |<-pickup_handlingtime->|<--pickup_traveltime-->|
              12:00                         12:20                               12:45  => delivery: 12:20 - 12:45
                |<---delivery_handlingtime--->|<-------delivery_traveltime------->|
                ^
            reftime
          ---------------

        status codes
           1 ... success
          -1 ... error
          -2 ... product not available at given reftime
          -3 ... product not covered by supply area



  action='optimizeTask'
  -------------

    Description:
      Makes a copy of the existing task and minimizes the cost by reordering the stops (traveling sales man problem).
      Please wait until this action is finished - it may take some time (up to several minutes)!
      Next, you might want to call action='getStopList' to retrieve the new sort sequence of the stops.
      The original sequence of the stops is lost.

    params:
        tasktoken     ... of the existing, not yet optimized task (required)

    response:
          array['statuscode']           ... see status codes below
          array['tasktoken']            ... of the newly generated, optimized task

        status codes
          -1 ... error
           1 ... success (but maybe same order: not optimization achieved)



  action='setTaskNote'  DEPRECATED: replaced by setTaskInfo
  -------------

    Description:
      Set plain text note for the given task.

    params:
        tasktoken     ... required (as obtained by action='createTask')
        type          ... required (level of visibility): [ public | inhouse | private ]
                            public: management + carriers + customers
                            inhouse: management + carriers
                            private: management
        note          ... plain text to be saved as note

    response:
          -1 ... error
           1 ... success


  action='setTaskInfo'
  -------------

    Description:
      Set additional plain text infos for given task. To reset a field, send empty value.
      All optional params (notepublic, noteinhouse, noteprivate, contactperson) that are
      not defined in a request remain unchanged.
      Maximal value lengths:
        2000 characters: notepublic, noteinhouse, noteprivate
         200 characters: contactperson

    params:
        tasktoken      ... required (as obtained by action='createTask')
        stopid         ... required (as obtained by action='addStop')
        notepublic     ... optional: public note (accessible by customer, carrier and management)
        noteinhouse    ... optional: inhouse note (accessible by carrier and management)
        noteprivate    ... optional: confidential note (accessible by management only)
        contactperson  ... optional: contactperson


    response:
          -1 ... error: missing/invalid parameter
          -2 ... error: value exceeds max string length
           1 ... success


  action='setStopNote'  DEPRECATED: replaced by setStopInfo
  -------------

    Description:
      Set plain text note for the given stop.

    params:
        tasktoken     ... required (as obtained by action='createTask')
        stopid        ... required (as obtained by action='addStop')
        type          ... required (see action='setTaskNote' for details)
        note          ... plain text to be saved as note

    response:
          -1 ... error
           1 ... success


  action='setStopInfo'
  -------------

    Description:
      Set additional plain text infos for given stop. To reset a field, send empty value.
      All optional params (notepublic, noteinhouse, noteprivate, contactperson, placename) that are
      not defined in a request remain unchanged.
      Maximal value lengths:
        2000 characters: notepublic, noteinhouse, noteprivate
         200 characters: contactperson, placename

    params:
        tasktoken      ... required (as obtained by action='createTask')
        stopid         ... required (as obtained by action='addStop')
        notepublic     ... optional: public note (accessible by customer, carrier and management)
        noteinhouse    ... optional: inhouse note (accessible by carrier and management)
        noteprivate    ... optional: confidential note (accessible by management only)
        contactperson  ... optional: contact person
        placename      ... optional: place name (=named address: eg. company name)


    response:
          -1 ... error: missing/invalid parameter
          -2 ... error: value exceeds max string length
           1 ... success


  action='setStopTime'
  -------------

    Description:
      Set a fixed time for the given stop.
      The fixed time can be ser either relative to the task's reference time (same date),
      or on a different date, if appointeddate parameter is given.
      Optionally you can set the a timecondition 'at', 'as from', or 'by' the fixed time.
      To reset the fxied time of a stop, simply set the appointedtime paramter to 0.

    params:
        tasktoken       ... required (as obtained by action='createTask')
        stopid          ... required (as obtained by action='addStop')
        appointedtime   ... required (24h format hh:mm, eg. 13:15)
                              0: to reset
        appointeddate   ... optional (format: YYYY-MM-DD)
        timecondition   ... optional (time condition: [ 0 | 1 | 2 ])
                              0: at (default)
                              1: as from
                              2: by

    response:
          -1 ... error (invalid/missing parameter)
          -2 ... invalid format of parameter appointedtime or appointeddate
           1 ... success


  action='orderTask'
  -------------

    Description:
      Place the order in the LoBo system. After this call no more changes can be made to task (via the API).

    params:
        tasktoken     ... required (as obtained by action='createTask')

    response:
          array['statuscode']          ... see status codes below
          array['statusurl']           ... URL pointing to detailed order status information ("Track'n'Trace")
          array['confirmationpdf']     ... download URL for task confirmation PDF
          array['shippingpdf']         ... download URL for shipping document PDF

        status codes
          -1 ... error
          -2 ... product not available at given reftime
          -3 ... product not covered by supply area
           1 ... success



  action='autoCompleteStreet'
  ------------------

    Description:
      Autocomplete street name based on an combination of a right wildcard and similarity search.
      If a street spans accross an area of different zip codes and/or city names it will be
      found for every unique combination.

    params:
        querystring    ... required
                           format: "street" OR "street, city" OR "street, zip city"
                                   street must preceed the comma seperated (optional) zip and/or city
        isocode        ... optional (limit results to ISO 3166-1 alpha-3 country code, eg.: AUT, DEU, CHE, ...)
        zip            ... optional (limit results to given zip code - exact match, overrules querystring zip)
        city           ... optional (limit results to given city name - exact match, overrules querystring city)

    response:
        empty if no result or on error!

        array of street suggestions (x: 0..n)
          array[x]['code']             ... country code
          array[x]['isocode']          ... corresponding isocode
          array[x]['zip']              ... zip code (corresponding to street)
          array[x]['city']             ... city name
          array[x]['street']           ... street name
          array[x]['housenumber']      ... extracted from querystring (common for all elements)
          array[x]['addition']         ... extracted from querystring (common for all elements)

    examples:
        loboApiCurl.php?action=autoCompleteStreet&querystring=Elisa
        loboApiCurl.php?action=autoCompleteStreet&querystring=Elisa,Graz&zip=8010



  action='autoCompletePlaceAndStreet'
  ------------------

    Description:
      Same functionality as action='autoCompleteStreet' (see above) but additionally returning *places* (named addresses)

    params:
        see action='autoCompleteStreet'

    response:
        empty if no result or on error!

        array of street suggestions (x: 0..n)
          array[x]['code']             ... country code
          array[x]['isocode']          ... corresponding isocode
          array[x]['zip']              ... zip code (corresponding to street)
          array[x]['city']             ... city name
          array[x]['street']           ... street name
          ^^^ up to here same as in action='autoCompleteStreet' ^^^
          array[x]['housenumber']      ... extracted from querystring OR from derived from place (if array[x]['isplace'] == 1)
          array[x]['addition']         ... extracted from querystring OR from derived from place (if array[x]['isplace'] == 1)
          array[x]['isplace']          ... defines if the result is place or a street
                                           0 ... street
                                           1 ... place
          array[x]['placeid']          ... id of the place (needs to be passed for further requests, eg. action='addStopByPlaceId')
          array[x]['name']             ... name of place
          array[x]['alias']            ... alias (short form of the name) -> equals name, if no alias exists

    examples:
        loboApiCurl.php?action=autoCompleteStreet&querystring=IBM
        loboApiCurl.php?action=autoCompleteStreet&querystring=IBM,Graz&zip=8010




  action='getCustomer'
  ---------------------

    Description:
      Get list of customers (matching filter criteria).

    params:
        customernumber ... optional: search string for customer number
                           wildcards: _ ... single char wildcard
                                   % ... multiple char wildcard
        name           ... optional: search string for name/alias
                           wildcards: _ ... single char wildcard
                                   % ... multiple char wildcard
        offset         ... optional: offset for results (default: 0)
        limit          ... optional: limit of results (default: 100, maximum: 100)

    response:
        empty if no result or on error!

        array of custoemrs (x: 0..n)
          array[x]['customernumber'] ... customer number
          array[x]['name']           ... full company name
          array[x]['alias']          ... alias (nick name)
          array[x]['street']         ... street name
          array[x]['housenumber']    ... housenumber
          array[x]['addition']       ... addition
          array[x]['addresssuffix']  ... addresssuffix
          array[x]['isocode']        ... isocode of country


    examples:
        loboApiCurl.php?action=getCustomer
        loboApiCurl.php?action=getCustomer&number=200975
        loboApiCurl.php?action=getCustomer&name=Start%



  action='createCustomer'
  ---------------------

    Description:
      Create new customer.

    params:
        placeid        ... required (as obtained by action='verifyAddress' or action='autoCompletePlaceAndStreet')
        name           ... required: full company name
        personal       ... required (data privacy: [ 0 | 1 ])
                             0: disabled (public company)
                             1: enabled (private person)
        alias          ... optional: nick name
        customernumber ... optional (if not given, an auto-incremented customer number is returned)
        vatnumber      ... optional
        addresssuffix  ... optional (eg.: /5/12)
        email          ... optional
        website        ... optional (starting with: http[s]://)
        phone1         ... optional


    response:
        array['customernumber']      ... new customer number (empty in case of error)
        array['statuscode']          ... see status codes below
        array['errormessage']        ... textual info on error

        status codes
          -1 ... Missing/incorrect parameter
          -2 ... Address (placeid) not found (check/create with action='verifyAddress' first!)
           1 ... success


    examples:
        loboApiCurl.php?action=createCustomer&placeid=393&name=Groupnet&personal=0&email=office@groupnet.at



  action='getZoneCompilation'
  ---------------------

    Description:
      List zone details of a given (zone based) product
      Zones can be either be based on geopolygons or on postal codes.

    params:
        productid      ... required (as obtained by action='getProductList')

    response:
        empty if no result or on error!

        array of zones (x: 0..n)
          array[x]['position']       ... precedence of the zone (the lower number is higher is the precedence, eg for overlapping zones)
          array[x]['name']           ... name of the zone
          array[x]['coords']         ... geopolygon of the zone (empty, if based on postal codes)
                                      format: {{lat1, lon1}, {lat2, lon2}, {lat3, lon3}}
                                      eg: {{47.078250,15.406180},{47.080940,15.405360},{47.083570,15.403480},{47.083860,15.404720}}
          array[x]['postalcodes']    ... comma seperated list of postal codes (empty, if based on geopolygons)
                                      wildcards: _ ... single char wildcard
                                                 % ... multiple char wildcard
          array[x]['isocode']        ... isocode of country (empty, if based on geopolygons)




  action='getStatistics'
  -------------

    Description:
      Get the following usage statistics:
        carriers   ... number of carriers that are (or were) active
        distance   ... distance served [unit: meters] (for zone-based: beeline distance)
        co2saving  ... savings in CO2 emissions [unit: grams]
      The statistics are calculated for the following periods:
        today
        month    ... within the last month
        year     ... within the last 12 months
        alltime  ... since start of records

    params:
        productid       ... optional filter (as obtained from action='getProductList')
        customernumber  ... optional filter (as obtained from action='getCustomer')

    response:
        empty if no result or on error!

        array(3,3)  1st dimension: 'carriers' | 'distance' | 'co2saving'
                    2nd dimension: 'today' | 'month' | 'year' | 'alltime'

          array['carriers']['today']
                        ...['month']
                        ...['year']
                        ...['alltime']
          array['distance']['today']
                        ...['month']
                        ...['year']
                        ...['alltime']
          array['co2saving']['today']
                         ...['month']
                         ...['year']
                         ...['alltime']


    example:
       loboApiCurl.php?action=getStatistics




  action='calculateTaskSimple'
  -------------

    DEPRECATED:
      This action is deprecated and will be removed in a future release!

    Description:
      Calculates the cost and transit time parameters based on a given product id and 2 addresses.

    params:
        productid     ... required (as obtained by action='getProductList')
        stop0         ... address string (e.g.: Hauptplatz 1, Linz)
        stop1         ... address string (e.g.: Hirschgasse 21, Linz)

    response:
          array['statuscode']             ... see status codes below
          array['attribution']            ... html code (something like: 'Powered by <a href="http://www.lobo.at">lobo.at</a>, based on &copy;<a href="http://cloudmade.com">CloudMade Services</a> (Map data &copy;<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright">ODbL</a>')
                                              MUST be displayed together with any other (piece of) information of this response!
          ---
          array['numberofstops']          ... number of recognized stops
          array['orderfee']               ... orderfee
          array['stopallowance']          ... stopallowance
          array['routecost']              ... route (distance) depended part or cost
          array['costtotal']              ... = array['allowance'] + array['routecost']
          array['costtotalincludingvat']  ... depending on vat rate
          array['co2saving']              ... savings in CO2 emissions [g/km]

          array['address'][x]             ... array of formatted addresses (of stopX)


        status codes
           1 ... success
          -1 ... error
          -2 ... unknown productid
         -10 ... address of stop0 not found
         -11 ... address of stop1 not found








----------------
 access via php
----------------

//   method 1 (based on function (un)serialize - native support):
//  ----------
      $myHost = "https://lobo.local";

      $queryUrl = "{$myHost}/api/loboApiCurl.php?action=getStatistics&responseFormat=base64_serialized";
      $serializedResponse = file_get_contents($queryUrl);
      $responseArray = unserialize(base64_decode($serializedResponse));

      print_r($responseArray);


//   method 2 (based on function json(_decode) - native support):
//  ----------
      $myHost = "https://lobo.local";

      $queryUrl = "{$myHost}/api/loboApiCurl.php?action=getStatistics";
      $jsonResponse = file_get_contents($queryUrl);
      $responseArray = json_decode($jsonResponse, true);

      print_r($responseArray);

*/




// request type of input field 'action' defines request method
if (isset($_POST['action']))
  $postArray = $_POST;
if (isset($_GET['action']))
  $postArray = $_GET;


// it's required to send clientIp with every request
$postArray['clientIp'] = $_SERVER['REMOTE_ADDR'];

// default responseFormat (if not set by request)
if (!isset($postArray['responseFormat']))
  $postArray['responseFormat'] = 'json';

// cast all values as string
// POST and GET values are string per default,
// but just in case this part is wrapped into a function
// we want to make sure that the json encoding is based on strings
// (otherwise the hash_hmac check will fail on the server side
foreach ($postArray as &$postValue)
  $postValue = (string)$postValue;

//echo(json_encode($postArray));

$publicHash = hash_hmac('sha256', json_encode($postArray), LOBO_API_PRIVATE_KEY);

$headerArray = array(
    'X-Client-Id: ' . LOBO_API_CLIENT_ID,
    'X-Public-Hash: ' . $publicHash
);


// process API request
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, LOBO_API_URL);
if (strpos(LOBO_API_URL, '127.0.0.1') > 0) {
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postArray);
curl_setopt($ch, CURLOPT_VERBOSE, true);
curl_setopt($ch, CURLOPT_STDERR, $verbose = fopen('php://temp', 'rw+'));

//$information = curl_getinfo($ch);
//echo($ch);

$response = curl_exec($ch);
//echo "Verbose information:\n", !rewind($verbose), stream_get_contents($verbose), "\n";
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);



switch ($http_status) {
  case 200:
    // handle content encoding
    switch ($postArray['responseFormat']) {
      case 'json':
        header('Content-type: application/json; charset=UTF-8');
        break;
      case 'base64_serialized':
        header('Content-type: plain/text; charset=UTF-8');
        break;
      case 'debug':
        header('Content-type: text/html; charset=UTF-8');
        break;
    }
    echo($response);
    break;

  case 404:
    header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
    exit();
    break;

  default:
    header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request");
    echo($response);
    exit();
    break;

}


?>