requirejs(["js/geojson"], function() {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
    //
    
        for (var i = 0; i < coords.length; i+2) {
                coordinatePairs.push(convertToPlaneCoords(coords[i], coords[i+1], 10));
        }
        console.log("coordinatePairs: " + coordinatePairs);

        


        function convertToPlaneCoords(coordinates_x, coordinates_y, radius) {
        var xyValues = {};
        var lon = coordinates_x;
        var lat = coordinates_y;
        console.log("lon: " + lon);
        console.log("lat: " + lat);

        x = (lat/180) * radius;
        y = (lon/180) * radius;
        xyValues['x'] = x;
        xyValues['y'] = y;
        return xyValues;
        }

        var xyzPoint;
        for (var i = 0; i < coordinates.length; i+2) {
        console.log("i: " + i);
        xyzPoint = convertLatLngToXYZ(coordinates[i+1], coordinates[i]);
        console.log(xyzPoint);
        pair.x = coordinates[i];
        pair.y = coordinates[i+1];
        coordinatePairs.push(pair);
        console.log("coordinatePairs" + coordinatePairs);
        };
        var convertLatLngToXYZ = function(lat, lng) {
            var xyzPoint = [];
            var phi   = (90-lat)*(Math.PI/180);
            var theta = (lng+180)*(Math.PI/180);

            x = -((10) * Math.sin(phi)*Math.cos(theta));
            z = ((10) * Math.sin(phi)*Math.sin(theta));
            y = ((10) * Math.cos(phi));
            xyzPoint.push(x);
            xyzPoint.push(y);
            xyzPoint.push(z);
            return xyzPoint;
        };
});