 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
       "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Abfrage per PHP</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
</head>
<body>

<div>

  <?php

// accessing the loboAPI through ### loboApiCurl.php ###
// 'clientIp' and 'apiKey' request parameters are handled automatically


  $protocol = 'https';
  if (empty($_SERVER['HTTPS'])) {
    $protocol = 'http';
  }


  $myHost = "{$protocol}://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);



  // Möglichkeit 1 (über json => entsprechenes PHP-Modul muss am Server installiert sein!)
  $queryUrl = "{$myHost}/loboApiCurl.php?action=getProductList";
  $jsonResponse = file_get_contents($queryUrl);
  $responseArray = json_decode($jsonResponse, true);

  echo("<h3>Abfrage per json(_decode)</h3>");

  $numberOfProducts = count($responseArray);
  echo("Anzahl der verfügbaren Produkte: " . $numberOfProducts);

  if ($numberOfProducts > 0) {
    echo("<br />");
    echo("Name des 1.Produkts: " . $responseArray[0]['name']);
  }

  echo("<br />");
  echo("<br />");


  echo("<h3>Get granted Actions</h3>");
  $res = json_decode(file_get_contents("{$myHost}/loboApiCurl.php?action=getGrantedActions"));
  foreach ($res as $value) {
    echo $value, '<br>';
  }
  //echo($res);



  // Möglichkeit 2 (über serialize => native PHP-Unterstützung)
  /*$queryUrl = "{$myHost}/loboApiCurl.php?action=getProductList&responseFormat=base64_serialized";
  $serializedResponse = file_get_contents($queryUrl);
  $responseArray = unserialize(base64_decode($serializedResponse));


  echo("<h3>Abfrage per unserialize</h3>");

  $numberOfProducts = count($responseArray);
  echo("Anzahl der verfügbaren Produkte: " . $numberOfProducts);

  if ($numberOfProducts > 0) {
    echo("<br />");
    echo("Name des 1.Produkts: " . $responseArray[0]['name']);
  }

  echo("<br />");
  echo("<br />");



  echo("<h3>print_r der Abfrage</h3>");
  echo("<pre>");
  print_r($responseArray);
  echo("</pre>");


  // Abfrage granted Actions
  $queryUrl = "{$myHost}/loboApiCurl.php?action=getGrantedActions";
  $jsonResponse = file_get_contents($queryUrl);
  $responseArray = json_decode($jsonResponse, true);

  echo("<h3>Abfrag Granted Actions</h3>");
  echo("Anzahl Actions: " . count($responseArray));*/


  ?>


</div>

</body>
</html>