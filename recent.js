var assert = require('assert');
var mongodb = require('mongodb');
var spawn = require('child_process').spawn;
var fs = require('fs');

var MongoClient = mongodb.MongoClient;
var	url = 'mongodb://134.58.106.9/admin';

var dbName = 'weather';

//currentime - 1 hour
var timeWindow = new Date().getTime() - 3600000;

MongoClient.connect(url, function(err, db) {
	if (err) 
		console.log('Unable to connect to the MongoDB server. Error:', err);
	else {
		console.log('Connected to ', url);
		// Authenticate
		console.log('Starting authentication...');
		db.authenticate('dries_gotink', 'r[x]dIntern!1', function(err, result) {
			if (err) 
				console.log('Unable to authenticate. Error:', err);
			else {
				assert.equal(true, result)
				console.log('Succesfully authenticated to database .', db.databaseName);
				db = db.db(dbName);
				console.log('Now connected to database .', db.databaseName);
				console.log('Requesting collections...')
				db.listCollections().toArray(function(err, colNames) {
					if (err) return  console.log(err);
					else {
						console.log('Succesfully obtained the collections.');
						colNames.forEach(function(name) {
							//For each collection start by exporting the data that is in the timeWindow
							console.log(name);
							var mongoExport = spawn('mongoexport', [ '--host', '134.58.106.9', '--authenticationDatabase', 
							'admin', '--username', 'dries_gotink', '--password', 'r[x]dIntern!1', '--db', db.databaseName,
							'--collection', name.name, /*'--query', '{"created_at": { "$gte": new Date(' + timeWindow + ') } }',*/ '--jsonArray',
							'-o', 'dump/' + dbName +'_' + name.name + '.json']);
							mongoExport.on('close', function() {
								//When a collection is exported, import it again in the recent db
								console.log('Child process completed: ', name.name, '. Now continuing to import this data...');
								var mongoImport = spawn('mongoimport', ['--db', 'recent', '--collection', dbName + '_' + name.name, 
								'--type', 'json', '--file', 'dump/' + dbName +'_' + name.name + '.json']);
								mongoImport.on('close', function() {
									console.log('Import collection completed: ', dbName + '_' + name.name, '. Now to rewrite the json file.');		
									fs.readFile('dump/' + dbName +'_' + name.name + '.json', 'utf8', function(err, data){
										if (err) 
											console.log('Unable to read file. Error:', err);
										else {
											console.log('Read file, proceeding with writing data.');
											var text = '{ "name": "' +  dbName +'_' + name.name + '",' + '"data":' + data + '}'
											fs.writeFile('D:/Workspaces/Netbeans Workspace/CityDashBoard/src/main/webapp/data/' + dbName +'_' + name.name + '.json', text, function(err){
												if (err) 
													console.log('Unable to write to file. Error:', err);
												else
													console.log('The file was succesfully written!');
											});
										}
									});
								});
							});
						});
						db.close();
					}
				});
			}
		});	
	}
});
