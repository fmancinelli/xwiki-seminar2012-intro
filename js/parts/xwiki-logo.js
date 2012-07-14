var XWikiLogoPart = (function() {
	/**
	 * Constants.
	 */
	var ID = "XWiki logo";

	/**
	 * Internal variables.
	 */
	var initialized = false;
	var started = false;
	var renderer = null;
	var scene = null;
	var camera = null;
	var tween = null;
	var xwikiLogo = null;
	var xwikiLogoPosition = {x : 0, y : 0, z : 1000, rx : 0};

	function getXWikiLogo() {
		xwikiLogo = new THREE.Object3D();

		cylinder = new THREE.CylinderGeometry(50, 50, 600, 50, 1, false);
		smallCylinder = new THREE.CylinderGeometry(25, 25, 150, 50, 1, false);

		material = new THREE.MeshBasicMaterial({
			color : 0xcfcfcf
		});
		mesh1 = new THREE.Mesh(cylinder, material);
		mesh1.rotation.x = 3.14 / 4.0;

		mesh2 = new THREE.Mesh(cylinder, material);
		mesh2.rotation.x = -3.14 / 4.0;

		material = new THREE.MeshBasicMaterial({
			color : 0x74b736
		});
		mesh3 = new THREE.Mesh(smallCylinder, material);
		mesh3.position.y = 250;

		material = new THREE.MeshBasicMaterial({
			color : 0xdf7c3e
		});
		mesh4 = new THREE.Mesh(smallCylinder, material);
		mesh4.position.y = -250;

		material = new THREE.MeshBasicMaterial({
			color : 0xc8202e
		});
		mesh5 = new THREE.Mesh(smallCylinder, material);
		mesh5.rotation.x = 3.14 / 2.0;
		mesh5.position.z = 250;

		material = new THREE.MeshBasicMaterial({
			color : 0x2073b2
		});
		mesh6 = new THREE.Mesh(smallCylinder, material);
		mesh6.rotation.x = 3.14 / 2.0;
		mesh6.position.z = -250;

		xwikiLogo.add(mesh1);
		xwikiLogo.add(mesh2);
		xwikiLogo.add(mesh3);
		xwikiLogo.add(mesh4);
		xwikiLogo.add(mesh5);
		xwikiLogo.add(mesh6);

		xwikiLogo.rotation.y = 3.14 / 2.0;

		return xwikiLogo;
	}
	
	function initTweens() {		
		function xwikiLogoUpdate() {
			xwikiLogo.position.x = xwikiLogoPosition.x;
			xwikiLogo.position.y = xwikiLogoPosition.y;
			xwikiLogo.position.z = xwikiLogoPosition.z;
			xwikiLogo.rotation.x = xwikiLogoPosition.rx;			
		}
		
		function xwikiLogoFreeRotate() {
			xwikiLogo.rotation.x += 0.02;
			xwikiLogo.rotation.y += 0.03;
		}
				
		tween = new TWEEN.Tween(xwikiLogoPosition).to({z: -500, rx: -6.28}, 4000).onUpdate(xwikiLogoUpdate);
		
		tween1 = new TWEEN.Tween({}).to({}, 10000).delay(1000).onUpdate(xwikiLogoFreeRotate);
		
		tween.chain(tween1);		
		
		tween.start(0);
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
			xwikiLogo.position.z = xwikiLogoPosition.z;
			scene.add(xwikiLogo);
						
			initialized = true;

			console.log(ID + " part initialized.");
		},
		
		start : function() {
			renderer.setClearColorHex(0x000020, 1.0);

			initTweens();
			
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

			TWEEN.update(params.localTime);
			
			renderer.render(scene, camera);
		}
	}

	return api;
})();
