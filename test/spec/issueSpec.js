/**
 * This set of tests are configured to challenge and test the values returned from
 * the chart.js and teamchart.js scripts
 */

describe("Return height of issue bar chart", function() {
    it("getChartHeight(bstyle) should return the value of 168", function() {
       var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getChartHeight(bstyle)).toEqual(168);
    })
});

describe("Return width of issue bar chart", function() {
    it("getChartWidth(bstyle) should return the value of 812", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getChartWidth(bstyle)).toEqual(812);
    })
});

describe("Return height of main issue bar chart", function() {
    it("getmainChartHeight(bstyle) should return the value of 180", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getmainChartHeight(bstyle)).toEqual(180);
    })
});

describe("Return width of main issue bar chart", function() {
    it("getmainChartWidth(bstyle) should return the value of 800", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(getmainChartWidth(bstyle)).toEqual(800);
    })
});

describe("Return incorrect height of issue bar chart", function() {
    it("getChartHeight(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 48, 72, 60, 40, 20, true)
        expect(getChartHeight(bstyle)).not.toEqual(168);
    })
});

describe("Return incorrect width of issue bar chart", function() {
    it("getChartWidth(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 42, 72, 60, 40, 20, true)
        expect(getChartWidth(bstyle)).not.toEqual(812);
    })
});

describe("Return incorrect height of main issue bar chart", function() {
    it("getmainChartHeight(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 44, 72, 60, 40, 20, true)
        expect(getmainChartHeight(bstyle)).not.toEqual(180);
    })
});

describe("Return incorrect width of main issue bar chart", function() {
    it("getmainChartWidth(bstyle) should return the incorrect value", function() {
        var bstyle = getBuildStyle(900, 301, 42, 71, 62, 40, 20, true)
        expect(getmainChartWidth(bstyle)).not.toEqual(800);
    })
});

describe("Return target datatype", function() {
    it("should return 'issues' as target datatype", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true)
        expect(bstyle.dataType).toEqual("issues");
    })
});


describe("Return an typeof Object", function() {
    it("should return specific values within object", function() {
        var bstyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, true);
        expect(bstyle).toEqual({
            w: 900,
            h: 300,
            top: 48,
            bottom: 72,
            left: 60,
            right: 40,
            padding: 20,
            dataType: 'issues'
        });
    })
});

describe("Return an typeof Number", function() {
    it("getRepoPercentage(arr, issues) should return typeof Number", function() {
        var tempArr = [];
        var arr = {
            issues: 1,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);
        expect(getMonthAvg(tempArr, "issues")).toEqual(jasmine.any(Number));
    })
});

describe("Return an average issues", function() {
    it("getMonthAvg(tempArr, issues) should return average amount", function() {
        var tempArr = [];
        var arr = {
            issues: 14,
            pulls: 34,
            name: "testObject"
        };
        var arr2 = {
            issues: 10,
            pulls: 34,
            name: "testObject"
        };
        var arr3 = {
            issues: 10,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);
        tempArr.push(arr2);
        tempArr.push(arr3);

        expect(getMonthAvg(tempArr, "issues")).toEqual(11);
    })
});


describe("Return NaN", function() {
    it("Function should return NaN when passed incorrect parameter", function() {
        var tempArr = [];
        var arr = {
            issues: 101,
            pulls: 34,
            name: "testObject"
        };
        tempArr.push(arr);

        expect(getMonthAvg(arr, "pulls")).toBeNaN();

    })
});

describe("Return correct month", function() {
    it("getMonthString(07) should return January", function() {
        expect(getMonthString("07")).toEqual("July");
    })
});

describe("Return correct day", function() {
    it("getDayFormat(1973-07-13) should return Mon", function() {
        expect(getDayFormat("1973-07-13")).toEqual("Fri");
    })
});


describe("Return an array consisting of year, month and day", function() {
    it("splitDashDate(1973-07-13) should return array with date split", function() {
        expect(splitDashDate("1973-07-13")).toEqual( [ '1973', '07', '13' ]);
    })
});

describe("Return string stating decrease in issues", function() {
    it("getComparisonFinalString(-1) should return Past 30 days ▼  1", function() {
        expect(getComparisonFinalString(-1)).toEqual('Past 30 days <span class=decrease>▼ </span> 1');
    })
});

describe("Return string stating no increase in issues", function() {
    it("getComparisonFinalString(0) should return Past 30 days ▶ No Gain", function() {
        expect(getComparisonFinalString(0)).toEqual('Past 30 days <span class=same>▶ </span>No Gain');
    })
});

describe("Return string stating increase in issues", function() {
    it("getComparisonFinalString(5) should return Past 30 days ▲  5", function() {
        expect(getComparisonFinalString(5)).toEqual('Past 30 days <span class=increase-icon>▲ </span>5');
    })
});

describe("Return correct day section of Unix Time Stamp", function() {
    it("stripDate(2014-09-30T20:28:24Z) should return 30", function() {
        var func = stripDate("day");
        expect(func("2014-09-30T20:28:24Z")).toEqual("30");
    })
});

describe("Return correct month section of Unix Time Stamp", function() {
    it("stripDate(2014-09-30T20:28:24Z) should return 09", function() {
        var func = stripDate("month");
        expect(func("2014-09-30T20:28:24Z")).toEqual("09");
    })
});

describe("Return an typeof Object", function() {
    it("getRepoPercentage(arr, issues) should return typeof Object", function() {
        var arr = ["test","array", "test"];
        expect(getRepoPercentage(arr, "issues")).toEqual(jasmine.any(Object));
    })
});

