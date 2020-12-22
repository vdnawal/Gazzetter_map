<?php
    if(isset($_POST['iso_code3']))
 {
    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {
        if($_POST['iso_code3'] == $feature['properties']['iso_a3'])
        {
            $temp = null;
            $temp['iso2'] = $feature['properties']['iso_a2'];
            $temp['iso3'] = $feature['properties']['iso_a3'];
            $temp['countryName'] = $feature['properties']['name'];
            $temp['geometry'] = $feature['geometry'];
            array_push($country, $temp);
        }
        
    }

  
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;
    $output['geoJson'] = $country[0]['geometry'];
    
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
   //print_r( $countryData );
 }  
    else
    {
        $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {
        $temp = null;
        $temp['iso2'] = $feature['properties']['iso_a2'];
        $temp['iso3'] = $feature['properties']['iso_a3'];
        $temp['countryName'] = $feature['properties']['name'];
        $temp['geometry'] = $feature['geometry'];
        
        array_push($country, $temp);
    }

  
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;
    $output['geoJson'] = $country[0]['geometry'];

 
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
    }
   //print_r( $countryData );
    
?>