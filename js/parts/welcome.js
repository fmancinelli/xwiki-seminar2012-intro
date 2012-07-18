var WelcomePart = (function() {
	/**
	 * Constants.
	 */
	var ID = "Welcome";

	/**
	 * Internal variables.
	 */
	var initialized = false;
	var started = false;
	var renderer = null;
	var scene = null;
	var camera = null;
	var mesh = null;

	/**
	 * Public API.
	 */
	var api = {
		/*
		 * Part initialization
		 */
		init : function(_renderer, params) {
			renderer = _renderer;

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(75, params.screenWidth
					/ params.screenHeight, 1, 10000);
			camera.position.z = 1000;
			scene.add(camera);

			geometry = new THREE.CubeGeometry(200, 200, 200);
			material = new THREE.MeshBasicMaterial({
				color : 0xff0000,
				wireframe : true
			});

			mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			initialized = true;

			console.log(ID + " part initialized.");
		},
		
		start : function() {
			started = true;
		},
		
		isStarted : function() {
			return started;
		},		

		/*
		 * Draw the next frame.
		 */
		drawFrame : function(params) {
			if (!initialized) {
				return;
			}

			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
