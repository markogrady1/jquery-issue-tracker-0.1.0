require('should')
var assert = require('chai').assert;
var helper = require('../../lib/helper');
var date = require('../../lib/date');
var mainController = require('../../lib/mainController');


var data;
describe('obtaining data from teams.json file', function(){
	it("should return a specific jquery repository name from teams.json", function() {
		var teams = require("../../repoData/teams.json");
		assert.equal('jquery-migrate', teams[0].responsibility[2])
	});

	it("should return the number of teams used in application", function() {
		var teams = require("../../repoData/teams.json");
		assert.lengthOf(teams, 15, 'teams.json should have 15 teams');
	})
});


describe('Number of jQuery repositories returned by web bot in rep.json.', function(){
	it("should return a specific number jquery repositories", function() {
		var repos = require("../../repoData/rep.json");
		assert.lengthOf(repos, 49, 'rep.json should have 49 repositories');
	});

	it("should return a specific jquery repository name from rep.json", function() {
		var repos = require("../../repoData/rep.json");
		assert.equal('jquery/api.globalizejs.com', repos[2].full_name)
	})
});

describe('Get PRs data', function(){
	
	var prString = '2015-08-26T02:00:03Z = 1440576003,\n2012-dev-summit  0,' +
		'\napi.globalizejs.com  0,\napi.jquery.com  4,\napi.jquerymobile.com  3,' +
		'\napi.jqueryui.com  0,\napi.qunitjs.com  0,\nblog.jquery.com-theme  0,' +
		'\nbrand.jquery.org  0,\ncodeorigin.jquery.com  0,\ncontent  0,' +
		'\ncontribute.jquery.org  2,\ncss-chassis  15,\ndemos.jquerymobile.com  1,' +
		'\ndownload.jqueryui.com  0,\nesprima  2,\nevents.jquery.org  0,\nglobalize  15,' +
		'\nglobalizejs.com  0,\ngrunt-jquery-content  0,\ngsoc  0,\nirc.jquery.org  1,' +
		'\njquery  26,\njquery-color  1,\njquery-compat-dist  0,\njquery-dist  0,\njquery-license  0,' +
		'\njquery-migrate  3,\njquery-mobile  22,\njquery-mousewheel  2,\njquery-release  0,' +
		'\njquery-simulate  6,\njquery-ui  29,\njquery-wp-content  5,\njquery.com  3,\njquery.github.io  0,' +
		'\njquery.org  1,\njquerymobile.com  1,\njqueryui.com  2,\nlearn.jquery.com  9,\nmeetings.jquery.org  0,' +
		'\nPEP  5,\nplugins.jquery.com  2,\nqunit  8,\nqunitjs.com  1,\nsizzle  4,\nstandards  0,\ntestswarm  3,' +
		'\nthemeroller.css-chassis.com  0,\nthemeroller.jquerymobile.com  1,\n';

	it('should return 2015-08-26T02:00:03Z in string', function(){
		var arrValue = helper.getSplitValue(prString, " =", 0);
		 assert.equal("2015-08-26T02:00:03Z", arrValue );

	});
	it('should return api.globalizejs.com in string', function(){

		var arrValue2 = helper.getSplitValue(prString, ",", 2);
		var arrValue3 = helper.getSplitValue(arrValue2, " ", 0);
		arrValue3 = arrValue3.replace("\n", "");
		assert.equal("api.globalizejs.com", arrValue3 );
	});
});

describe('Closed issues json file', function(){
	it('should return an array', function(){
		var doc = require("../../repoData/issues/closed/2_closed_issues.json");
		assert.typeOf(doc, 'array');
	});

	it('should return number of closed issues from file', function(){
		var doc = require("../../repoData/issues/closed/2_closed_issues.json");
		var num = doc.length;
		assert.typeOf(num, 'Number');
	});

	it('should return the correct path', function(){
		var str = "mark";
		var el = mainController.preparePath(str)
			assert.equal( 'https://api.github.com/repos/jquery/mark/events', el);
	});
});

describe('Change endian format of date with dateFormatDash() function', function(){
	it('should return a big endian formated date', function(){
		date.dateFormatDash("2016-12-12", "B", (newDate) => {
			assert.equal(newDate, '12-12-2016');
		})
	});

	it('should return a middle endian formated date', function(){
		date.dateFormatDash("2016-12-12", "M", (newDate) => {
			assert.equal(newDate, "12-2016-12");
		})
	});

	it('should return a little endian formated date', function(){
		date.dateFormatDash("12-2016-12", "L", (newDate) => {
			assert.equal(newDate, "12-2016-12");
		})
	});
});


describe('Change endian format of date with dateFormatSlash() function', function(){
	it('should return a big endian formated date', function(){
		date.dateFormatSlash("2016/12/12", "B", (newDate) => {
			assert.equal(newDate, '12-12-2016');
		})
	});

	it('should return a middle endian formated date', function(){
		date.dateFormatSlash("2016/12/12", "M", (newDate) => {
			assert.equal(newDate, "12-2016-12");
		})
	});

	it('should return a little endian formated date', function(){
		date.dateFormatSlash("12/2016/12", "L", (newDate) => {
			assert.equal(newDate, "12-2016-12");
		})
	});
});


describe('Change endian format of date with dateEndian() function', function(){
	it('should return the format of date to be used with big endian', function(){
		date.dateEndian("2016/12/12", "B", (newDate) => {
			assert.equal(newDate, '1-0-2');
		})
	});

	it('should return the format of date to be used with middle endian', function(){
		date.dateEndian("2016/12/12", "M", (newDate) => {
			assert.equal(newDate, '0-2-1');
		})
	});

	it('should return the format of date to be used with little endian', function(){
		date.dateEndian("12/2016/12", "L", (newDate) => {
			assert.equal(newDate, '1-2-/');
		})
	});
});

describe('Return the difference of dates in milliseconds', function(){
	it('should return difference of two given dates in milliseconds', function(){
		var time = date.timeFormat(true);
		time("2015-08-26T02:00:03Z", "2016-08-26T02:00:03Z", (timeFormat) => {
			assert.equal(timeFormat, '31622400');
		})
	});

	it('should return the format of date in the form of a string', function(){
		var time = date.timeFormat(false);
		time("2015-08-26T02:00:03Z", "2016-08-26T02:00:03Z", (timeFormat) => {
			assert.typeOf(timeFormat, 'string');
		})
	});
});




