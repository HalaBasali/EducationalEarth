var renderer = null;
var scene = null;
var camera = null;
var cube = null;

var duration = 5000; //ms
var currentTime = Date.now();

function animate() {
	var now = Date.now();
	var deltat = now - currentTime;
	currentTime = now;
	var fract = deltat/ duration;
	var angle = Math.PI * 2 * fract;
	cube.rotation.y += angle;
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

	// Create a texture-mapped cube and add it to the scene
	// First, create the texture map
	var mapUrl = "images/webgl-logo-256.jpg";
	var texloader = new THREE.TextureLoader();
	var map = texloader.load(mapUrl); 

	// Now create a Basic material; pass in the map
	var material = new THREE.MeshBasicMaterial({ map: map});
	// Create the cube geometry
	var geometry = new THREE.CubeGeometry(2, 2, 2);

	// And put the Geometry and material together into a mesh
	cube = new THREE.Mesh(geometry, material);

	// Move the mesh back from the camera and tilt it toward the viewer
	cube.position.z = -8;
	cube.rotation.x = Math.PI / 5;
	cube.rotation.y = Math.PI / 5;

	// Finally, add the mesh to our scene
	scene.add(cube);

	// Run the run loop
	run();
});