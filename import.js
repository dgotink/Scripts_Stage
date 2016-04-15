var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient,
	url = /*'mongodb://134.58.106.9/admin'*/ 'mongodb://localhost:27017/';
	
var database;

module.exports =  {
	setup : function(){
		MongoClient.connect(url, function(err, db) {
			database = db;
		});
	},
	insert : function(dbName, collectionName, input) {
		input['created_at'] = new Date(input['created_at']);
		database = database.db(dbName);
		database.collection(collectionName).insertOne(input);
	},
	end : function(){
		database.close();
	}
};