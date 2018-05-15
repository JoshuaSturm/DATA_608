// var files = ["/data/ACS_09_1YR_S1701_with_ann.csv", "/data/ACS_10_1YR_S1701_with_ann.csv", "/data/ACS_11_1YR_S1701_with_ann.csv", "/data/ACS_12_1YR_S1701_with_ann.csv", "/data/ACS_10_1YR_S1701_with_ann.csv"];
// var promises = []

// files.forEach(function(url) {
//     promises.push(d3.csv(url))
// });

// Promise.all(promises).then(function(values) {
// 	values.forEach(function (d) {
		
// 	});
//     console.log(values)
// });

d3.csv('/data/combined.csv').then(function (data) {
	data.forEach(function (d) {
	d.Total = +d.Total;
	d.Male = +d.Male;
	d.Female = +d.Female;
	d.Under18 = +d.Under18;
	d.a18to64 = +d.a18to64;
	d.over65 = +d.over65;
	d.oneRace = +d.oneRace;
	d.White = +d.White;
	d.AfricanAmerican = +d.AfricanAmerican;
	d.Native = +d.Native;
	d.Asian = +d.Asian;
	d.Hawaiian = +d.Hawaiian;
	d.otherRace = +d.otherRace;
	d.Multiracial = +d.Multiracial;
	d.totPovertyFamilyHousehold = +d.totPovertyFamilyHousehold;
	d.totPovertyOtherLivingArrangements = +d.totPovertyOtherLivingArrangements;
	d.totPoverty25 = +d.totPoverty25;
	d.totPoverty25NoHS = +d.totPoverty25NoHS;
	d.totPoverty25HS = +d.totPoverty25HS;
	d.totPoverty25SomeCollege = +d.totPoverty25SomeCollege;
	d.totPoverty25Bachelors = +d.totPoverty25Bachelors;
	d.totPovertyAmericanBorn = +d.totPovertyAmericanBorn;
	d.totPovertyForeignBorn = +d.totPovertyForeignBorn;
	d.totPovertyNaturalizedCitizen = +d.totPovertyNaturalizedCitizen;
	d.totPovertyDisability = +d.totPovertyDisability;
	d.totPovertyNoDisability = +d.totPovertyNoDisability;
	d.totPoverty16to64 = +d.totPoverty16to64;
	d.totPoverty16to64WorkedFT = +d.totPoverty16to64WorkedFT;
	d.totPoverty16to64WorkedPT = +d.totPoverty16to64WorkedPT;
	d.totPoverty16to64NoWork = +d.totPoverty16to64NoWork;
	d.Year = +d.Year;
    });

    // Create dc.js objects, and link them to the html divs
    var timeChart = dc.barChart("#dc-time-chart");
    var raceChart = dc.pieChart("#dc-race-chart");


    // var facts = crossfilter(data);

    // Calculations
    var staticColumns = ["FIPS_Code", "County", "State", "Total", "Male", "Female", "Under18", "a18to64",
    "over65", "oneRace", "Multiracial", "totPovertyFamilyHousehold", "totPovertyOtherLivingArrangements",
    "totPoverty25", "totPoverty25NoHS", "totPoverty25HS", "totPoverty25SomeCollege", "totPoverty25Bachelors", "totPovertyAmericanBorn",
    "totPovertyForeignBorn", "totPovertyNaturalizedCitizen", "totPovertyDisability", "totPovertyNoDisability", "totPoverty16to64",
    "totPoverty16to64WorkedFT", "totPoverty16to64WorkedPT", "totPoverty16to64NoWork", "Year"];
    var ndx = crossfilter(melt(data, staticColumns, 'race', 'count'));
    var raceDim = ndx.dimension(function (d) { return d.race; });
    var yearDim = ndx.dimension(d => d.Year);


 //    yearslices = {
 //    	slice1:d3.sum(data, function(d) {return d.totPovertyWhite;}),
 //    	slice2:d3.sum(data, function(d) {return d.totPovertyAfricanAmerican;}),
 //    	slice3:d3.sum(data, function(d) {return d.totPovertyAmericanAndAlaskanNative;}),
 //    	slice4:d3.sum(data, function(d) {return d.totPovertyAsian;}),
 //    	slice5:d3.sum(data, function(d) {return d.totPovertyNativeHawaiianPacificIslander;}),
 //    	slice6:d3.sum(data, function(d) {return d.totPovertyOtherRace;})
 //    }

 //    var raceD = facts.dimension(function(data) { 
 //   		return yearslices; 
	// });

	var raceG = raceDim.group().reduceSum(function (d){
		return d.count;
	});

	var yearG = yearDim.group();

	raceChart
		.width(768)
		.height(480)
		.dimension(raceDim)
		.group(raceG)
		.legend(dc.legend())
		.externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)
		.on('renderlet', function(chart) {
		    chart.selectAll('rect').on('click', function(d) {
		        console.log('click!', d);
		    });
		});

	timeChart
		.width(1500)
		.height(150)
		.dimension(yearDim)
		.group(yearG)
		.gap(1)
		.x(d3.scaleTime().domain([2010,2016]))



	var byYear = d3.nest()
 		.key(function(d) { return d.Year; })
  		.entries(data);
  		console.log(byYear);

 	dc.renderAll();
});	



// References
//https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue
//https://stackoverflow.com/questions/36890785/single-crossfilter-dimension-and-group-on-two-columns