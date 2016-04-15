define(["three", "jquery"], function(THREE, $) {

document.addEventListener('mouseover', onMouseOver, false);
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event) {
	// console.log("MOUSEDOWN");
    event.preventDefault();

    // var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 1, 10000);
    // projector.unprojectVector(vector, camera);

    // var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    // var intersect = raycaster.intersectObject(sphere);
    // if (intersect.length > 0) {
    //     console.log(sphere.position);
    // }
}

function onMouseOver(event) {
	// console.log("MOUSEOVER");
    event.preventDefault();

    // var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 1, 10000);
    // projector.unprojectVector(vector, camera);

    // var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    // var intersect = raycaster.intersectObject(sphere);
    // if (intersect.length > 0) {
    //     console.log(sphere.position);
    // }
}

});

