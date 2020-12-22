<?php
  //var_dump($_REQUEST);
	$executionStartTime = microtime(true) / 1000;
	$_REQUEST['capitalCity'] = str_replace(' ', '%20', $_REQUEST['capitalCity']);
    $url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q='.$_REQUEST['capitalCity'].'&maxRows=3&username=vrunda&style=full';
   // echo $url.'</br>';
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');
	// print_r($output);
	echo json_encode($output); 
   
    
    ?>

