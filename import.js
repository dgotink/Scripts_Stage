var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient,
	url = 'mongodb://134.58.106.9/admin';
	
var database;

module.exports =  {
	setup : function(callback){
		MongoClient.connect(url, function(err, db) {
			database = db;
			database.authenticate('dries_gotink', 'r[x]dIntern!1', function(err, result){
				if(err)
					console.log('Unable to authenticate to database. ', err);
				else {
					console.log('Succesfully authenticated.');
					callback();
				}
			});
		});
	},
	insertOne : function(dbName, collectionName, input, callback) {
		input['created_at'] = new Date(input['created_at']);
		database = database.db(dbName);
		database.collection(collectionName).insertOne(input, callback)
		console.log('Inserted ', collectionName);
	},
	insertMany : function(dbName, collectionName, input, callback) {
		input.forEach(function(entry) {
			entry['created_at'] = new Date(entry['created_at']);
		})
		database = database.db(dbName);
		database.collection(collectionName).insertMany(input, callback)
		console.log('Inserted ', collectionName);
	},
	end : function(){
		database.close();
		console.log('Database closed.');
	}
};