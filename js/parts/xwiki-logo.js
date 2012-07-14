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
	var xwikiLogo = null;
	
	function getXWikiLogo() {
	    xwikiLogo = new THREE.Object3D();
		
		cylinder = new THREE.CylinderGeometry(50, 50, 600, 50, 1, false);
		smallCylinder = new THREE.CylinderGeometry(30, 30, 150, 50, 1, false);
				
		material = new THREE.MeshBasicMaterial({
			color : 0xff0000,
			wireframe : true
		});				
		mesh1 = new THREE.Mesh(cylinder, material);
		mesh1.rotation.x = 3.14/4.0;		
		
		material = new THREE.MeshBasicMaterial({
			color : 0x00ff00,
			wireframe : true
		});
		mesh2 = new THREE.Mesh(cylinder, material);
		mesh2.rotation.x = -3.14/4.0;
		
		mesh3 = new THREE.Mesh(smallCylinder, material);
		mesh3.position.y = 250;
		
		mesh4 = new THREE.Mesh(smallCylinder, material);
		mesh4.position.y = -250;
		
		mesh5 = new THREE.Mesh(smallCylinder, material);
		mesh5.rotation.x = 3.14 / 2.0;
		mesh5.position.z = 250;
		
		mesh6 = new THREE.Mesh(smallCylinder, material);
		mesh6.rotation.x = 3.14 / 2.0;
		mesh6.position.z = -250;
		
		xwikiLogo.add(mesh1);
		xwikiLogo.add(mesh2);
		xwikiLogo.add(mesh3);
		xwikiLogo.add(mesh4);
		xwikiLogo.add(mesh5);
		xwikiLogo.add(mesh6);
		
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
			
			xwikiLogo = getXWikiLogo();
			scene.add(xwikiLogo);

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

			xwikiLogo.rotation.x += 0.04;
			xwikiLogo.rotation.y += 0.02;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
