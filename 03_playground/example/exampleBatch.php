 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
       "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Abfrage per PHP</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
</head>
<body>

<div>

  <?

// accessing the loboAPI through ### loboApiCurl.php ###
// 'clientIp' and 'apiKey' request parameters are handled automatically


  $protocol = 'https';
  if (empty($_SERVER['HTTPS']))
    $protocol = 'http';

  $myHost = "{$protocol}://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);


  // -----------------------
  // 1) get get product list
  // -----------------------

  $queryUrl = "{$myHost}/loboApiCurl.php?action=getProductList";
  $jsonResponse = file_get_contents($queryUrl);
  $responseArray = json_decode($jsonResponse, true);


  // -----------------------
  // 2) do a batch "getStatistics" over all products
  // -----------------------

  // create batch query
  $queryUrl = "{$myHost}/loboApiCurl.php";
  $batchQueryArray = array();
  foreach ($responseArray as $product) {
    $batchQueryArray[] = array('action' => 'getStatistics',
                               'productid' => $product['productid']);
  }


  /*
    // OPTION1: via GET
    // (limited to 8096 chars!)
    $queryUrl = "{$myHost}/loboApiCurl.php?action=batch";
    $batchQueryArray = array();
    foreach ($responseArray as $product) {
      $batchQueryArray[] = array('action' => 'getStatistics',
                                'productid' => $product['productid']);
    }
    $queryUrl .= '&queries=' . urlencode(json_encode($batchQueryArray));
    $jsonResponse = file_get_contents($queryUrl);
  */
 

  // OPTION2: via POST
  $postdata = http_build_query(
      array(
          'action' => 'batch',
          'queries' => json_encode($batchQueryArray)
      )
  );
  $opts = array('http' =>
      array(
          'method'  => 'POST',
          'header'  => 'Content-type: application/x-www-form-urlencoded',
          'content' => $postdata
      )
  );
  $context = stream_context_create($opts);
  $jsonResponse = file_get_contents($queryUrl, false, $context);


  // output result
  $responseArray = json_decode($jsonResponse, true);
  echo("<h3>print_r der Abfrage</h3>");
  echo("<pre>");
  print_r($responseArray);
  echo("</pre>");

  ?>


</div>

</body>
</html>