define(["init"], function(init) {
	var coordinatePairs = new Array();

	for(var i= 0; i < init.coords.length; i+2) {
	    console.log("coords[i]: " + coords[i]);
	    console.log("coords[i+1]: " + coords[i+1]);
	    coordinatePairs[i]["lon"] = coords[i];
	    coordinatePairs[i]["lat"] = coords[i + 1];
	    console.log("coordinatePairs: " + coordinatePairs);
	}
});