var request = require('request'),
	async = require('async'),
	insert = require('./import.js');

var base_url = 'http://data.irail.be/Bikes/',
	suffixes = {
		'Antwerpen': 'Velo',
		'Brussel': 'Villo'
	};

var cities = ['Antwerpen', 'Brussel'];
var internal_counter = 0;

insert.setup();

//foreach city GET the data
async.each(cities, function(city, callback){
	var suffix = suffixes[city];
	var url = base_url + suffix + '.json';
	request(url, function(error, response, body){
		//if succesful, get the relevant data and add it to output
		if(!error && response.statusCode === 200){
			var time = new Date().getTime();
			var data = JSON.parse(body);			
			data[suffix].forEach(function(entry){
				delete entry.latitude;
				delete entry.longitude;
				entry['created_at'] = new Date(time);
				insert.insert('bikes', city, entry);
			});			
		}
	});
});

var end = function() {
	insert.end();
}

	


