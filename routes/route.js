var migrate = require("../schema/repoMigrate")
	, schema = require("../schema/repository")
	, df = require("../lib/date")
	, helper = require("../lib/helper")
	, reslv = require("../lib/mainController")
    , monthly = require("../lib/monthController")
	, express = require("express")
	, auth = require("../config/auth")
	, router = express.Router()
    , fs = require("fs")
    , _ = require("lodash")
    , async = require("async")
    , teamsControl = require("../lib/teamsController")
    , color = helper.terminalCol();

// condition to check if local-server storage has been set already
if (typeof localStorage === "undefined" || localStorage === null) {
	  var LocalStorage = require("node-localstorage").LocalStorage;
	  localStorage = new LocalStorage("./scratch");
}

var app;
var acc = [], dtt = [];
console.log(color["cyan"],"Router Initialised.");

//route for the home page
router.get("/", (req, res) => {
	var avaNum = reslv.getAvatarImage();
    var username = reslv.getStorageItem(0);

	migrate.repositoryMigrate();
	var prs, c;
	console.log(color["cyan"]+color["yellow"],"Router:"," GET /index");
    function getFlagData(callback) {
        if (avaNum !== "undefined") {
            res.locals.userStat = true;
            var data = reslv.getStorage();
            reslv.getFlagData(data, (flagObj, att) => {
                callback(flagObj, att);
            });
        } else {
            res.locals.userStat = false;
            callback(null)
        }
    }

    //inner function to retreive pull requests and insert them into complete repository data
    reslv.getPRs("pulls", (pullsdata) => {
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
		prs = pullsdata;
		compDoc = schema.completeDoc;
		localStorage.setItem("state", c);

	for(var i = 0; i < compDoc.length; i++){
      for(var k = prs.length-1; k >=0; k--){
        var name = prs[k].split("  ");
        if(compDoc[i].name == name[0])
          	compDoc[i].pulls = name[1];
      }
     }


     reslv.cacheRepoData(compDoc);
        var teamData = require("../repoData/teams.json");

        // obtain any flags that may have been set and render the home page
        getFlagData((flag, att) => {
            if(typeof att === "undefined") {
                att = null;
            }

            res.render("index", {
                names: schema.names,
                issuesNo: schema.issues,
                completeDoc: compDoc,
                pullsNo: prs,
                urlstate: urlstate,
                state: c,
                header: "",
                av: avaNum,
                username: username === "undefined" ? null : username,
                dashboardLink: "dashboard",
                logoutLink: "logout",
                flagData:flag,
                attention: att,
                teams: teamData,
                avatar_url: null
            })
		});
		io.emit("userStatus", { av: avaNum })
	});
});

//route for single repository data
router.get("/repo/details/:repoName?", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/details/:" + req.params.repoName);
  	var nameParam = null;
  	nameParam = req.params.repoName;
  	reslv.resolveIssueData(nameParam, req, res, io);
});

//route for single repository data
router.get("/repo/details/competitor-closure-avg/:competitorName?", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/details/competitor-closure-avg/:" + req.params.competitorName);
    var nameParam = null;
    nameParam = req.params.competitorName;
    var clIssues;
    reslv.getClosedIssueNo(nameParam, (closedNumber) => {
        clIssues = closedNumber[closedNumber.length-1].issues;
    });

    reslv.getClosedNo(nameParam, (pullClosedNumber, pullDat, issueClosedNumber, issueDat) => {
        var pullTimeString = "";
        var issueTimeString = "";
        reslv.getTimeString(pullDat, (time) => {
            pullTimeString = time;
        });

        reslv.getTimeString(issueDat, (time) => {
            issueTimeString = time;
        });

        res.writeHead(200, {'content-type': 'text/json' });
        res.write( JSON.stringify({ pullString: pullTimeString, issuesString: issueTimeString } ) );
        res.end('\n');
    });

    });

router.get("/repo/details/change-issue-month/:repo/:range", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/details/change-issue-month/:" + req.params.repo+"/"+req.params.range);
    var range = req.params.range;
    var repo = req.params.repo;
    console.log(range, repo)
    monthly.getNewMonth(repo, range,req, res, io, (obj) => {
        res.writeHead(200, {'content-type': 'text/json' });
        res.write( JSON.stringify({ obj } ) );
        res.end('\n');
    }, range);

});

router.get("/jquery/team/:teamName?", (req, res) => {
    var c;
    var selectedTeam = req.params.teamName;
    helper.noCache(res);
    var avatar = reslv.getAvatarImage();
    if(avatar === "undefined") {
        res.locals.userStat = false;
    } else {
        res.locals.userStat = true;
        c = helper.getRandomString();
        var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
    }

    console.log(color["cyan"]+color["yellow"],"Router:"," GET /jquery/team/:" + selectedTeam);

    teamsControl.getTeamData(selectedTeam, "repoPullsHistory", req, res, (teamPullsData) => {
        teamsControl.getTeamData(selectedTeam, "repoHistory", req, res, (teamIssueData) => {
            teamsControl.getRecord(selectedTeam, "repositories", (doc) => {
                res.render("team-view", {
                    teamsData: doc,
                    av: avatar,
                    header: selectedTeam + " Team",
                    urlstate: urlstate,
                    state: c,
                    issuesData: teamIssueData,
                    pullsData: teamPullsData,
                    logoutLink: "../../logout",
                    dashboardLink: "../../dashboard",
                    avatar_url: null
                })
            })
        })
    });
});

//route for single repository details
router.get("/repo/issue/details/:team?", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/issue/details/:" + req.params.repoName);
  	var nameParam = null;
  	nameParam = req.params.team;
  	reslv.resolveIssueDates(nameParam, req, res);
});


//route for login page ==> GET
router.get("/logins", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /logins");
    query = require("url").parse(req.url, true).query;
    var state = query.state;
    var code = query.code;
    var localState = localStorage.getItem("state");
    var request = require("request");

    if (state === localState) {
        helper.print(color['cyan'],"Matched: ", localState + " TOKEN");
         request.post(
                "https://github.com/login/oauth/access_token?client_id=" + auth.github_client_id + "&client_secret=" + auth.github_client_secret + "&code=" + code, {
                    form: {
                        key: "value"
                    }
             },
             function(error, response, body) {
                 console.log(color['cyan']+color['yellow']+color['white'],"GET " , response.statusCode,": Oauth HTTP status code.");
                 if (!error && response.statusCode == 200) {

                     var section = body.split("&");
                     access_t = helper.getSplitValue(section[0], "=", 1);

                     var requestify = require("requestify");

                     requestify.get("https://api.github.com/user?access_token=" + access_t)
                         .then(function(response) {
                             acc = response.getBody();
                             reslv.resetStorage();
                             acc = setBodyValue(acc, res)
                             reslv.initiateRegistration(req, res, state, acc, this.io);
                         });
                 }
             }
         );
    }
});

//route for login page ==> GET
router.post("/login", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /login");
    username = req.body.username;
    	password = req.body.password;
	reslv.validateLogin(req, res, (result, data) => {
		if(!result) {
    			res.redirect("/login");
		} else {
			req.session.username = data[0].username;
			app.locals.username = data[0].username;
            res.locals.userStat = true;
			res.redirect("/");
		}
	});
});

//route for adding the attention pin to the repo list item
router.post("/repo/details/attention", (req, res) => {
    var userAvatar = req.body.userAvatar;
    var username = req.body.username;
    var attentionTarget = req.body.attentionTarget;
    var email = req.body.email;
    schema.assignAttentionMarker(attentionTarget, username, email, userAvatar, (response) => {
        console.log(response)
    });
    res.end();
});

//route for removing the attention pin
router.post("/remove-pin", (req, res) => {
    var username = req.body.username;
    var team = req.body.repoName;
    schema.removePin(username, team, (data) => {
       return data;
    });
});

//route for the register page requests
router.get("/register", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /register");
	reslv.initiateRegistration(req, res);
});

//route for posting the users email data
router.post("/register", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /logins");
    reslv.validateRegistration(req, res);
});

//route for logging out
router.get("/logout", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /logout");
    reslv.removeLoggedInStatusofUser();
    res.locals.userStat = false;
	req.session.destroy();
	var localState = localStorage.setItem("state", "");
	app.locals.username = "";
	avatar = false;
	res.redirect("/");
});

//route for requesting the users dashboard
router.get("/dashboard", (req, res) => {
    helper.noCache(res);
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /dashboard");
    var avatar = reslv.getAvatarImage();
	if(avatar === "undefined") {
        res.locals.userStat = false;
		res.redirect("/")
	} else {
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
        function getFlagData(callback) {
            if (avatar !== "undefined") {
                res.locals.userStat = true;
                var data = reslv.getStorage();
                reslv.getFlagData(data, (flagObj, attData, teamObj) => {
                    callback(flagObj, attData, teamObj);
                    console.log(flagObj, attData, teamObj)
                });
            } else {
                res.locals.userStat = false;
                callback(null)
            }
        }
        var teamsJSONValues = require('../repoData/teams.json');
        compDoc = schema.completeDoc;
        getFlagData((flag, attention, teamFlag) => {
            res.render("dashboard", {
                // state: "true",
                teamsJSONValues: teamsJSONValues,

                av: avatar,
                header: "Dashboard",
                urlstate: urlstate,
                state: c,
                dashboardLink: "",
                compDoc: compDoc,
                logoutLink: "logout",
                flag: flag,
                attention: attention,
                teamFlag: teamFlag,
                avatar_url: null
            });
        })

	}
});

//route for posting the dashboard settings
router.post("/dashboard/edit/repo", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /dashboard/edit/repo");
    var watchTarget = req.body.watchTarget;
    var receiveEmail = req.body.receiveEmail;
    var flagIssuesChart = req.body.flagIssuesChart;
    var flagPullsChart = req.body.flagPullsChart;

    var issueBoundary = req.body.issueSlider;
    var pullsBoundary = req.body.pullsSlider;
    var showEveryIncrease = req.body.showEveryIncrease;
console.log(watchTarget, issueBoundary, pullsBoundary)
    watchTarget = watchTarget === "Watch" ? null : watchTarget;

    var data = localStorage.getItem("data");
    var name = helper.getSplitValue(data, "=>", 0);
    var email = helper.getSplitValue(data, "=>", 2);
    var avatar = helper.getSplitValue(data, "=>", 1);
    avatNum = helper.getSplitValue(avatar, "/", -1);
    var watcher = {
        user: name,
        email: email,
        avatar: avatar,
        repoTarget: watchTarget,
        receiveEmailUpadate: receiveEmail,
        highlightissueschart: flagIssuesChart,
        highlightpullschart: flagPullsChart,
        issuesboundary: issueBoundary,
        pullsboundary: pullsBoundary,
        showEveryIncrease: showEveryIncrease

    };
    res.send("Data Received");

    reslv.assignWatcher(watcher);
});


//route for posting the dashboard settings
router.post("/dashboard/edit/team", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /dashboard/edit/team");
    var teamWatchTarget = req.body.watchTarget;
    var teamReceiveEmail = req.body.receiveEmail;
    var teamFlagIssuesChart = req.body.flagIssuesChart;
    var teamFlagPullsChart = req.body.flagPullsChart;

    var teamIssueBoundary = req.body.issueSlider;
    var teamPullsBoundary = req.body.pullsSlider;
    var teamShowEveryIncrease = req.body.showEveryIncrease;
console.log(teamWatchTarget)

console.log(teamReceiveEmail)
console.log(teamFlagIssuesChart)
console.log(teamFlagPullsChart)
console.log(teamIssueBoundary)
    console.log(teamPullsBoundary)
console.log(teamShowEveryIncrease)
    teamWatchTarget = teamWatchTarget === "Watch" ? null : teamWatchTarget;
    //
    var data = localStorage.getItem("data");
    var name = helper.getSplitValue(data, "=>", 0);
    var email = helper.getSplitValue(data, "=>", 2);
    var avatar = helper.getSplitValue(data, "=>", 1);
    avatNum = helper.getSplitValue(avatar, "/", -1);
    var teamWatcher = {
        user: name,
        email: email,
        avatar: avatar,
        teamTarget: teamWatchTarget,
        receiveEmailUpadate: teamReceiveEmail,
        highlightissueschart: teamFlagIssuesChart,
        highlightpullschart: teamFlagPullsChart,
        issuesboundary: teamIssueBoundary,
        pullsboundary: teamPullsBoundary,
        showEveryIncrease: teamShowEveryIncrease

    };
    res.send("Data Received");

    reslv.assignTeamWatcher(teamWatcher);
});

//route for 404 requests
router.get("*", (req, res) => {
	res.end("<h1>you\"ve been 404\"d</h1>");
});

// function responsible for setting and returning the users GitHub details
var setBodyValue = function(body, res) {
	var bd = body;
	 localStorage.setItem("data","");
	 localStorage.setItem("data", bd.login + "=>" + bd.avatar_url + "=>" + bd.email + "")

	return  {
		"login": bd.login,
		"email": bd.email,
		"avatar_url": bd.avatar_url
	};
};

// return the router module
module.exports = function(appl, serv, io) {
	app = appl;
	this.io = io;
	app.locals.username = "";
	return router;
};
