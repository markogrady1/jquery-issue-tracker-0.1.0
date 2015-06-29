var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, df = require('../lib/date')
	, reslv = require('../lib/resolve')
	, express = require('express')
	, router = express.Router();

console.log('router called');
//route for the home page
router.get('/', function(req, res){
	migrate.repositoryMigrate();
	console.log('index router called');
	res.render('index', {
		names: schema.names,
		issuesNo: schema.issues,
		header: 'Main page'
		});

});

//route for single repository data
router.get('/repo/details/:repoName?', function(req, res) {
	console.log('repoName router called');
  	var nameParam = null;
  	nameParam = req.params.repoName;
  	
  	reslv.resolveIssueData(nameParam, req, res);
  	
});


router.get('/repo/issue/details/:team?', function(req, res) {
	console.log('team issues router called');
  	var nameParam = null;
  	nameParam = req.params.team;

  	reslv.resolveIssueDates(nameParam, req, res);
});

function resolveDate(fullDate) {
	partDate = fullDate.split(' = ');

	return partDate[0];
}

router.get('/login', function(req, res) {
	console.log('login page called');
	reslv.initiateLogin(req, res);
});


router.post('/login', function(req, res){
    	username = req.body.username;
    	password = req.body.password;
	reslv.validateLogin(req, res, function(result){
		if(!result) {
    			res.redirect('/login');
		} else {
			res.redirect('/');
		}
	});
});

router.get('/register', function(req, res) {
	console.log('register page called');
	reslv.initiateRegistration(req, res);
});

router.post('/register', function(req, res) {
	var result = reslv.validateRegistration(req, res);
	if (!result) {
		res.redirect('/register');
	} else {
		res.redirect('/');
	}
});
//STATUS: 404 back-up
router.get('*', function(req, res) {
	res.end('<h1>you\'ve been 404\'d</h1>');
});

module.exports = router;
