//declare the variable globally
let iso_code2;
let iso_code3;
let capital = '';
let currency_symbol;
let cur_symbol;
let currencyCode;
let countryCode;
let countryName = '';
let countryGeoJson = [];
let geoJsonLayer = [];
let lat;
let lng;
let mymap;

//style for geojson 
var geoJsonStyle = {
    "color": "blue",
    "opacity": 0.8,
    "weight": 2,
}

//create a function  for country List
function getCountryList(){
    $.ajax({
        url: 'libs/php/countryList.php',
        type:'POST',
        dataType:'JSON',
        success:(result) => {
            console.log(result);
            selCountry = $('#selCountry')
            result['data'].forEach(country => {
                selCountry.append(`<option value = ${country['iso3']} + value = ${country['iso2']}>${country['countryName']}</option>`);

                
            });
        },error: function(jqXHR, textStatus, errorThrown){
            console.log('country not selected');
        }
    })
}
//when document ready call the function
$(document).ready(function(){
    getCountryList();
     mainFunction();
     
 
 })

//main function 
function mainFunction(){
    if(navigator.geolocation){
        console.log("Geolocation is available");
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
    else{
        alert("Geolocation is not supported to your browser");
    }

}

//successFunction
function successFunction(position){
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log(lat,lng)
    mymap = L.map('map').setView([lat, lng],6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
       
    }).addTo(mymap);

    //add easy button icon on map to show data
    L.easyButton('fa fa-info',function(){
        $('#countryInfo').modal("show");

    },'Country Information').addTo(mymap );

    L.easyButton('fa-wikipedia-w',function(){
        $('#wikiInfo').modal("show");
    },'Wikipedia Information').addTo(mymap );

    L.easyButton('fa fa-cloud',function(){
    $('#weatherInfo').modal("show");
    },'Weather Information').addTo(mymap );

    L.easyButton('fa-clock',function(){
        $('#newsInfo').modal("show");
    },'News').addTo(mymap);

    L.easyButton('fa fa-dollar',function(){
        $('#curInfo').modal("show");
    },'Currency Information').addTo(mymap);
   

    //to get the current country name
    $.ajax({
        url:'libs/php/currentCountry.php',
        type:'POST',
        dataType:'json',
        data:{
            latitude: lat,
            longitude:lng
        },
        success: function(result){
            console.log(result)
             //countryName = result['results'][0]['components']['country'];
             //iso_code2 = result['results'][0]['components']['ISO_3166-1_alpha-2'];
            
            
             iso_code3 = result['results'][0]['components']['ISO_3166-1_alpha-3'];
             cur_symbol = result['results'][0]['annotations']['currency']['symbol'];
             //countryCode = result['results'][0]['components']['country_code'];
             $(`#selCountry option[value='`+iso_code3+`']`).prop('selected', true);
            countryInformation(iso_code3);

        //to set coutry borders with geojson Layer
        $.ajax({
            url:'libs/php/countryList.php',
            type:'POST',
            data:{iso_code3 :iso_code3 },
            dataType: 'JSON',
            success:(result) => {
                console.log("-------------data for geoJson Layer-------")
                console.log(result);
                countryGeoJson = result['geoJson'];
                createGeoJson(countryGeoJson);
            }

             })
        }
    })
}

//error function
function errorFunction(e){
    console.log(e.message);
}


//function for geoJson Layer for country Border
function  createGeoJson(geoJson){
    console.log(geoJson);
    if(geoJsonLayer){
        mymap.removeLayer(geoJsonLayer)
    }
    geoJsonLayer = L.geoJson(geoJson, {
        style: geoJsonStyle
    }).addTo(mymap);
    mymap.fitBounds(geoJsonLayer.getBounds());

}

//get countryInformation
function countryInformation(iso_code3){
    $.ajax({
        url:'libs/php/countryInfo.php',
        type:'POST',
        dataType: 'json',
        data:{
            iso_code3 : iso_code3
        },
        success:function(result){
            console.log(result);
            if(result.status.name == "ok"){
                capital = result['data'][0]['capital'];
                currencyCode = result['data'][0]['currencies'][0]['code'];
                countryCode = result['data'][0]['alpha2Code'];

                console.log("-------------------------get capital, currencyCode from country information--------------------");
                console.log(capital,currencyCode, countryCode);

                //show the data inside model
                $('#flag').attr("src",result['data'][0]['flag']);
                $('#flag').css("width","100px");
                $('#flag').css("width","100px"); 
                $('#country_name').html(result['data'][0]['name']);
                $('#capital').html(result['data'][0]['capital']);
                $('#population').html(result['data'][0]['population']);
                $('#area').html(result['data'][0]['area']);
                $('#language').html(result['data'][0]['languages'][0]['name']);
                $('#region').html(result['data'][0]['region']);
                $('#calling_code').html(result['data'][0]['callingCodes']);
                cur_symbol = result['data'][0]['currencies'][0]['symbol'];
                $("#country_code").html(iso_code3);
                var t = result['data'][0]['timezones'][0];
                $("#timezone").html(t);
                console.log(cur_symbol);
                getWeather(capital);
                wikipediaData(capital);
                getNews(countryCode);
                getExchangeRate(currencyCode);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log('Country data not found');
        }
    })

}

//get weather information
function getWeather(capital){
    $.ajax({
        url:'libs/php/getWeather.php',
        type:'POST',
        dataType:'json',
        data:{
            capitalCity : capital
        },
        success:function(result){
            console.log("------------get weather data------------")
            console.log(result);
            if(result.status.name == "ok"){
                   //show the data inside model
                   var iconcode = result.data.weather[0].icon;;
                   var src = "http://openweathermap.org/img/w/" + iconcode + ".png";
                  $('#wi').attr("src",src);
                  $('#feels').html(result['data']['main']['feels_like']);
                  $('#humidity').html(result['data']['main']['humidity']);
                  
                  $('#min_temp').html(result['data']['main']['temp_min']);
                  $('#max_temp').html(result['data']['main']['temp_max']);
                  
                  $('#description').html(result['data']['weather'][0]['description']);
                  $('#windspeed').html(result['data']['wind']['speed']);
                  $('#pressure').html(result['data']['main']['pressure']);
            }

        }
    })

}
//get wikiData information
function  wikipediaData(capital){
    $.ajax({
        url:'libs/php/wikipedia.php',
        type:'POST',
        dataType:'json',
        data:{
            capitalCity : capital
        },
        success:function(result){
            console.log("----------------------Wikidata-------------------------");
            console.log(result);
            //console.log(result['data']['geonames'][0]['countryCode'])
            if(result.status.name =="ok"){
                 //show the data inside model
                $('#sum1').html(result['data']['geonames'][0]['summary']);
                $('#thumb1').attr("src",result['data']['geonames'][0]['thumbnailImg']);
                $('#thumb1').css("width","100%");

                $('#sum2').html(result['data']['geonames'][1]['summary']);
                $('#thumb2').attr("src",result['data']['geonames'][1]['thumbnailImg']);
                $('#thumb2').css("width","100%");
                
                $('#sum3').html(result['data']['geonames'][2]['summary']);
                $('#thumb3').attr("src",result['data']['geonames'][2]['thumbnailImg']);
                $('#thumb3').css("width","100%");
            }
           
        }
    })

}
//get news data
function getNews(countryCode){
    $.ajax({
        url:'libs/php/news.php',
        type:'POST',
        data:{countryCode: countryCode},
        dataType:'json',
        success: function(result){
            console.log('----------------------News data------------------------');
            console.log(result);
        }
    })

}

//exchange Rate data
function getExchangeRate(currencyCode){
    $.ajax({
        url: 'libs/php/exchangeRate.php',
        type:'POST',
        data:{currencyCode:currencyCode},
        dataType:'json',
        success:function(result){
            console.log('---------------------exchangeRate Data------------------------')
            console.log(result);
            s = result.data.rates[currencyCode];
            $("#er").html(s);
            $("#cc").html(countryCode);
            $("#cs").html(cur_symbol);   
                 
        }

    })

}



//on  country select chage data
 $('#selCountry').change(function(){
    var sel_iso3 =  $('#selCountry').find(':selected').val();

    countryInformation(sel_iso3);
    
 
   
        $.ajax({
            url:'libs/php/countryList.php',
            type:'POST',
            data : {"iso_code3":sel_iso3},
            dataType: 'JSON',
            success:(result) => {
               countryGeoJson = result['geoJson'];;
               createGeoJson(countryGeoJson);
                    
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Country not found');
        }
      });

 });