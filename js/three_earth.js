var renderer = null;
var scene = null;
var camera = null;
var earth = null;
var starsBackground = null;

var duration = 15000; //ms
var currentTime = Date.now();

function animate() {
	var now = Date.now();
	var deltat = now - currentTime;
	currentTime = now;
	var fract = deltat/ duration;
	var angle = Math.PI * 2 * fract;
	earth.rotation.y += angle;
}

function run() {
	requestAnimationFrame( function() { run(); });

	//Render the scene
	renderer.render( scene, camera);

	// Spin the cube for next frame
	animate();
}

$(document).ready(function() {
	var canvas = document.getElementById("webglcanvas");

	// Create the Three.js renderer  and attach it to our canvas
	renderer = new THREE.WebGLRenderer(
		{ canvas: canvas, antialias: true} );

	// Set the viewport size
	renderer.setSize(canvas.width, canvas.height);

	// Create a new Three.js scene
	scene = new THREE.Scene();

	// Add a camera so we can view the scene with a 45° perspective, viewport dimensions,
	// front and back clipping plane values
	camera = new THREE.PerspectiveCamera (45, canvas.width/ canvas.height, 1, 4000);
	scene.add(camera);

	var mapUrlEarth = "images/earthmap1k.jpg";
	var texLoaderEarth = new THREE.TextureLoader();
	var mapEarth = texLoaderEarth.load(mapUrlEarth); 
	var geometryEarth = new THREE.SphereGeometry(1, 32, 32); // radius, segments in width, segments in height
	var materialEarth = new THREE.MeshBasicMaterial({ map: mapEarth});
	earth = new THREE.Mesh(geometryEarth, materialEarth);

	earth.position.z = -4;
	earth.rotation.x = Math.PI / 5;
	earth.rotation.y += Math.PI / 5;

	var mapUrlStars= "images/stars.jpg";
	var texloaderStars = new THREE.TextureLoader();
	var mapStars = texloaderStars.load(mapUrlStars); 
	var geometryStars = new THREE.SphereGeometry(90, 64, 64);
	var materialStars = new THREE.MeshBasicMaterial({map: mapStars, side: THREE.BackSide});
	starsBackground = new THREE.Mesh(geometryStars, materialStars);
	starsBackground.position = -8;

	// Finally, add the mesh to our scene
	//scene.add(cube);
	scene.add(starsBackground);
	scene.add(earth);

	// Run the run loop
	run();
});
