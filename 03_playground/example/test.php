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
  echo($jsonResponse);
  $responseArray = json_decode($jsonResponse, true);
  //echo($responseArray);



  ?>


</div>

</body>
</html>