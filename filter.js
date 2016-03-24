//function filterData(xName, yName, input, output){
	var xName = "created_at";
	var yName = "temperature";
	var input = "weather_antwerp.json";
	var output = "outputtest.json";
	var fs = require('fs');
	var filteredData = "";
	fs.readFile(input, 'utf8', function(err, data){
		if (err) 
			console.log('Unable to read file. Error:', err);
		else {
			var object = JSON.parse(data);
			var dataArr = object.data;
			dataArr.forEach(function (i) {
				var line = '{ "x": "' + i[xName].$date + '", "y": ' + i[yName] + ' },';
				filteredData += line;
			});
			var out = '{ "name": "' + object.name + '", "data": [' + filteredData + ']}'
			fs.writeFile(output, out, function(err){
				if (err) 
					console.log('Unable to write file. Error:', err);
				else
					console.log('File written!');
			});
		}
	});
//}
