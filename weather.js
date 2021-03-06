var request = require('request'),
	insert = require('./import.js');

var base_url = 'http://api.openweathermap.org/data/2.5/weather?q=',
    key = '&appid=831b063db7bce4f9b393b3ff168b84cd',
    type  = '&mode=json',
	metric = '&units=metric';

var cities = ['Antwerpen', 'Leuven'];
var internal_counter = 0;

//foreach city GET the data
var method = function (){

	var close_callback = function() {
	internal_counter++;
	if(internal_counter === cities.length) insert.end();
	}

	cities.forEach(function(city){
		var url = base_url + city + key + type + metric;
		request(url, function(error, response, body){
			//if succesful, get the relevant data and add it to output
			if(!error && response.statusCode === 200){
				var time = new Date().getTime()
				var data = JSON.parse(body);
				var output = {};
				output['created_at'] = new Date(time);
				output['temperature'] = data.main.temp;
				output['min_temperature'] = data.main.temp_min;
				output['max_temperature'] = data.main.temp_max;
				output['humidity'] = data.main.humidity;
				output['pressure'] = data.main.pressure;
				output['windspeed'] = data.wind.speed;
				output['cloudpercentage'] = data.clouds.all;
				insert.insertOne('weather', city, output, close_callback);
			}
		});
		
	});
}

insert.setup(method);
