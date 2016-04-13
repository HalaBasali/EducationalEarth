requirejs.config({
	paths: {
		"jquery":[ 		"https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min",
						// If the CDN fails, load from this local module instead
						"libs/jquery-2.1.4.min"
				],
		"init": 		"init",
		"polygonLoader":"polygonLoader",
		"three" : 		"../libs/three.min",
		"converter": 	"coords_converter",
		"threeGeo": 	"../libs/threeGeoJSON",
		"trackback": 	"../libs/TrackballControls",
		"pnltri":		"../libs/pnltri.min"
	}
});


require(["init","three","threeGeo", "trackback"]);
