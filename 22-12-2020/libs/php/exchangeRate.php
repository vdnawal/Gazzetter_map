<?php

	$executionStartTime = microtime(true) / 1000;
	//print_r($_POST);
	//$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'].'&username=vrunda&style=full';
	$url='https://api.currencyfreaks.com/latest?apikey=79694c535c0345fd81d866dbb82b30a9&symbols='.$_POST['currencyCode'];
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