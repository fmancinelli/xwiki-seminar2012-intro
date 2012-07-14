var XWikiLogoPart = (function() {
	/**
	 * Constants.
	 */
	var ID = "XWiki logo";

	/**
	 * Internal variables.
	 */
	var initialized = false;
	var renderer = null;
	var scene = null;
	var camera = null;
	var mesh = null;
	
	function getXWikiLogo() {
	    xwikiLogo = new THREE.Geometry();
		
		cylinder = new THREE.CylinderGeometry(30, 30, 600, 50, 1, false);
		mesh1 = new THREE.Mesh(cylinder);
		mesh2 = new THREE.Mesh(cylinder);
		mesh2.position.x = 60;
		
		THREE.GeometryUtils.merge(xwikiLogo, mesh1);
		THREE.GeometryUtils.merge(xwikiLogo, mesh2);
		
		return xwikiLogo;
	}

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

			geometry = getXWikiLogo(); //new THREE.CubeGeometry(200, 200, 200);
			material = new THREE.MeshBasicMaterial({
				color : 0xff0000,
				wireframe : true
			});

			mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			initialized = true;

			console.log(ID + " part initialized.");
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
