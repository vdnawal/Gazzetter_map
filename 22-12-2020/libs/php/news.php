<?php

	$executionStartTime = microtime(true) / 1000;
	//print_r($_POST);
	//$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'].'&username=vrunda&style=full';
	$url='http://newsapi.org/v2/sources?language=en&country='.$_POST['countryCode'].'&apiKey=f6159f1d14f842cf991a74e36817565e';
	
	//echo $url;
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
	//print_r($output);
	echo json_encode($output); 
	

?>