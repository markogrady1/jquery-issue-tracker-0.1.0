var tmpLog = require('../lib/tmpLogger');
var MongoClient = require('mongodb').MongoClient;

var request = require('request');

exports.repositoryMigrate = function(){
	tmpLog.update('DATA MIGRATION', 'repositories loading...', false);

	MongoClient.connect("mongodb://127.0.0.1:27017/repositories", function(err, db){
	if(err) throw err;	
	db.collection('repos').remove({});
	var allRepos = require('../repoData/rep');	    	
    db.collection('repos').insert(allRepos, function(err, data){
    
    	if(err) throw err;
    	
    	tmpLog.update('DATA MIGRATION', 'jquery repositories loaded', true);
		db.close();
    	});
	});
}

MongoClient.connect("mongodb://127.0.0.1:27017/issues", function(err, db){

	if(err) throw err;

	for(var i = 1; i < 49; i++){
		var obj = require('../repoData/issues/open/' + i + "_issues");
		if(obj == ""){
			continue
		}
        
        var url = obj.map(function(data) {return data.url; });
	    var urlValue = url.toString();
	    var nameArr = urlValue.split('/');
	    var dataName = nameArr[5];
	    db.collection(dataName).remove({});
        db.collection(dataName).insert(obj, function(err, data){

            if(err) throw err;

        });
	}
	tmpLog.update('DATA MIGRATION', 'jquery open issues loaded', true);
});


exports.pullsMigrate = function() {

	MongoClient.connect("mongodb://127.0.0.1:27017/pulls", function(err, db){

		if(err) throw err;

		for(var i = 1; i < 49; i++){
			var obj = require('../repoData/pulls/open/' + i + "_pulls");
			if(obj == ""){
				continue
			}
        
	        var url = obj.map(function(data) {return data.url; });
		    var urlValue = url.toString();
		    var nameArr = urlValue.split('/');
		    var dataName = nameArr[5];
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){

            if(err) throw err;

        	});
		}
		// db.close();
		tmpLog.update('DATA MIGRATION', 'jquery open pulls loaded', true);
	});
}

exports.closedDataMigration = function(targetData){
MongoClient.connect("mongodb://127.0.0.1:27017/" + targetData + "Closed", function(err, db){


if(err) throw err;

		for(var i = 1; i < 49; i++){
			obj = require('../repoData/' + targetData + '/closed/' + i + "_closed_" + targetData + "");
			if(obj == ""){
				continue
			}
        
	        var url = obj.map(function(data) {return data.url; });
		    var urlValue = url.toString();
		    var nameArr = urlValue.split('/');
		    var dataName = nameArr[5];
		    db.collection(dataName).remove({});
		    var batch = db.collection(dataName).initializeUnorderedBulkOp({useLegacyOps: false}); //enable bulk inserting of data because of high numbers
		    for(var j = 0; j < obj.length; j++){	
		    	batch.insert({  
		    		url: obj[j].url,
			    	id: obj[j].id, 
			    	title: obj[j].title,
			    	body: obj[j].body,
			    	created_at: obj[j].created_at,
			    	updated_at: obj[j].updated_at,
			    	closed_at: obj[j].closed_at,
			    	assignee: obj[j].assignee
			    });
		    }
		    batch.execute(function(err, result){});
		}

		db.close();
		tmpLog.update('DATA MIGRATION', 'jquery closed ' + targetData + ' loaded', true);
});
}




	
