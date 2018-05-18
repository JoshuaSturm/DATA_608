
d3.csv('melted2.csv').then(function (data) {
	data.forEach(function (d) {
	d.County = d.County;
	d.State = d.State;
	d.Total = +d.Total;
	d.Year = +d.Year;
	d.Work = d.Work;
	d.wCount = +d.wCount;
	d.Disabled = d.Disabled;
	d.dCount = +d.dCount;
	d.Education = d.Education;
	d.eCount = +d.eCount;
	d.Race = d.Race;
	d.rCount = +d.rCount;
	d.Age = d.Age;
	d.aCount = +d.aCount;
	d.Gender = d.Gender;
	d.gCount = +d.gCount;
    });

    // Create dc.js objects, and link them to the html divs
    var timeChart = dc.barChart("#dc-time-chart");
    var genderChart = dc.pieChart("#dc-gender-chart");
    var raceChart = dc.pieChart("#dc-race-chart");
    var ageChart = dc.barChart("#dc-age-chart");
    var disChart = dc.barChart("#dc-disabled-chart");
    var eduChart = dc.rowChart("#dc-education-chart");
    var workChart = dc.rowChart("#dc-work-chart");
    
   

    // Create Crossfilter
    var ndx = crossfilter(data);

    // Create Dimensions
    var yearDim = ndx.dimension(d => d.Year);
    var genderDim = ndx.dimension(d => d.Gender);
    var raceDim = ndx.dimension(d => d.Race);
    var ageDim = ndx.dimension(d => d.Age);
    var disDim = ndx.dimension(d => d.Disabled);
    var eduDim = ndx.dimension(d => d.Education);
    var workDim = ndx.dimension(d => d.Work);


	// var sexDim = generalDim.filterFunction(multivalue_filter([["Male", "Female"]]));
	// var sexDim = generalDim.filterFunction(function (d){ return d == "Male" || d === "Female"; });
	// var sexDim = generalDim.filter("Male");
	// var sexDim = ndx.dimension(d => d.variable == "Male" || d.variable == "Female");
	// var sexDim = ndx.dimension(function(d){if(d.variable =="Male" || d.variable=="Female") {return d.variable;}});
	// var sexDim = generalDim.filterExact(["Female"]);

	// Create Groups
	var yearG = yearDim.group().reduceSum(d => d.Total / 864);
	var genderG = genderDim.group().reduceSum(d => d.gCount / 432);
	var raceG = raceDim.group().reduceSum(d => d.rCount / 144);
	var ageG = ageDim.group().reduceSum(d => d.aCount / 288);
	var disG = disDim.group().reduceSum(d => d.dCount / 432);
	var eduG = eduDim.group().reduceSum(d => d.eCount / 216);
	var workG = workDim.group().reduceSum(d => d.wCount);

	genderChart
		.width(668)
		.height(380)
		.dimension(genderDim)
		.group(genderG)
		.legend(dc.legend())
		.externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)

    ageChart
	    .width(668)
		.height(380)
		.dimension(ageDim)
		.group(ageG)
		.x(d3.scaleBand())
		.xUnits(dc.units.ordinal)
		.brushOn(false)
	    .xAxisLabel('Age')
	    .barPadding(0.1)
	    .outerPadding(0.05)

	raceChart
		.width(668)
		.height(380)
		.dimension(raceDim)
		.group(raceG)
		.legend(dc.legend())
		.externalLabels(50)
		.externalRadiusPadding(50)
        .drawPaths(true)

    disChart
	    .width(668)
		.height(380)
		.dimension(disDim)
		.group(disG)
		.x(d3.scaleBand())
		.xUnits(dc.units.ordinal)
		.brushOn(false)
	    .xAxisLabel('Disability?')
	    .barPadding(0.1)
	    .outerPadding(0.05)

	eduChart
		.width(480)
	    .height(280)
	    .x(d3.scaleLinear())
	    .elasticX(true)
	    .dimension(eduDim)
	    .group(eduG)

    workChart
		.width(480)
	    .height(280)
	    .x(d3.scaleLinear())
	    .elasticX(true)
	    .dimension(workDim)
	    .group(workG)

	timeChart
		.width(1800)
		.height(150)
		.dimension(yearDim)
		.group(yearG)
		.gap(1)
		.x(d3.scaleTime().domain([2010,2016]))
		.elasticX(true)



	// var byYear = d3.nest()
 // 		.key(function(d) { return d.Year; })
 //  		.entries(data);
 //  		console.log(byYear);


 	dc.renderAll();
});	



// References
//https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue
//https://stackoverflow.com/questions/36890785/single-crossfilter-dimension-and-group-on-two-columns