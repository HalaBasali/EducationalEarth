 define(["three", "jquery", "threeGeo", "trackback","pnltri"], function() {
 //New scene and camera
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 1000 );
        camera.zoom = 1;
        //Set the camera position
        camera.position.z = 20;

        //New Renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //Add lighting
        scene.add(new THREE.AmbientLight(0x333333));

        var mapUrlEarth = "images/earth.jpg";
        var texLoaderEarth = new THREE.TextureLoader();
        var mapEarth = texLoaderEarth.load(mapUrlEarth); 
        var materialEarth = new THREE.MeshBasicMaterial({ map: mapEarth});
        var geometryEarth = new THREE.SphereGeometry(10, 32, 32); // radius, segments in width, segments in height
        earth = new THREE.Mesh(geometryEarth, materialEarth);
        earth.rotation.y = Math.PI *1.5;
        scene.add(earth);

        var mapUrlStars= "images/stars.jpg";
        var texloaderStars = new THREE.TextureLoader();
        var mapStars = texloaderStars.load(mapUrlStars); 
        var geometryStars = new THREE.SphereGeometry(90, 64, 64);
        var materialStars = new THREE.MeshBasicMaterial({map: mapStars, side: THREE.BackSide});
        starsBackground = new THREE.Mesh(geometryStars, materialStars);
        starsBackground.position = -8;

        // Add the stars mesh to our scene
        scene.add(starsBackground);

        //Draw the GeoJSON
        var worldPolygonData = $.getJSON("geojsonData/world.geojson", function (data) { 
            drawThreeGeo(data, 10, 'sphere', {
                color: 'black'
            })
        });
        var germanyPolygonData = $.getJSON("geojsonData/germany.geojson", function (data) { 
            drawThreeGeo(data, 10, 'sphere', {
                color: 'red'
            })
        });


        var coordinates;
        var coords;
        var coordinatePairs = [];

        $.getJSON("js/germany.json", function(data) {
            coordinates = data.geometry.coordinates;
            coords = coordinates[0].toString().split(',');
            console.log("coords.length: " + coords.length);
            console.log("coordinates: " + coordinates);


        });

    // define polygon with holes
    var example_data = [
        // Contour
        [ { x:0.0, y:0.0 }, { x:30.0, y:0.0 }, { x:30.0, y:40.0 }, { x:0.0, y:40.0 } ]
                        ];
            // triangulate the polygon with holes
    var myTriangulator = new PNLTRI.Triangulator();
    var triangList = myTriangulator.triangulate_polygon( germanyPolygonData);

    // output the result
    var resultStr = ( triangList ) ?
            triangList.map( function(tri) { return "[ "+tri.join(", ")+" ]" } ).join(", ") :
            'NO Triangle-List!';
    resultDiv = document.createElement('div');
    resultDiv.innerHTML = '<p/>'+resultStr+'<p/>';
    document.body.appendChild( resultDiv );
            //Enable controls
            var controls = new THREE.TrackballControls(camera);

    //Render the image
    function render() {
        controls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
});