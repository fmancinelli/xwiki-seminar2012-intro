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
	var xwikiLogoPosition = {
		x : 0,
		y : 0,
		z : 1000,
		rx : 0
	};

	var xwikiText = null;
	var xwikiTextPosition = {
		x : 0,
		y : 0,
		z : 1000,
		rx : 0,
		ry : 0,
		rz : 0
	};

	function createText(text, _color, _size) {
		var text3d = new THREE.TextGeometry(text, {
			size : _size,
			height : 10,
			curveSegments : 2,
			font : "helvetiker"

		});

		text3d.computeBoundingBox();
		var centerOffsetX = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
		var centerOffsetY = -0.5 * (text3d.boundingBox.max.y - text3d.boundingBox.min.y);

		var _textMaterial = new THREE.MeshBasicMaterial({
			color : _color,
			overdraw : true,
			opacity : 1.0
		});
		text = new THREE.Mesh(text3d, _textMaterial);

		return {
			mesh : text,
			centerOffsetX : centerOffsetX,
			centerOffsetY : centerOffsetY
		};
	}

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

		function xwikiTextUpdate() {
			xwikiText.mesh.position.x = xwikiTextPosition.x;
			xwikiText.mesh.position.y = xwikiTextPosition.y;
			xwikiText.mesh.position.z = xwikiTextPosition.z;
			xwikiText.mesh.rotation.x = xwikiTextPosition.rx;
			xwikiText.mesh.rotation.y = xwikiTextPosition.ry;
			xwikiText.mesh.rotation.z = xwikiTextPosition.rz;
		}

		function xwikiLogoFreeRotate() {
			xwikiLogo.position.x = xwikiLogoPosition.x;
			xwikiLogo.position.y = xwikiLogoPosition.y;
			xwikiLogo.position.z = xwikiLogoPosition.z;
			xwikiLogo.rotation.x += 0.02;
			xwikiLogo.rotation.y += 0.03;
		}

		TWEEN.removeAll();

		/* Begin of XWiki logo tween definition */

		tween = new TWEEN.Tween(xwikiLogoPosition).to({
			z : -500,
			rx : -6.28
		}, 4000).onUpdate(xwikiLogoUpdate);

		tween1 = new TWEEN.Tween({}).to({}, 31500/* 40000 */).delay(3850).onUpdate(xwikiLogoFreeRotate);

		tween2 = new TWEEN.Tween(xwikiLogoPosition).to({
			z : 1000,
			y : 500
		}, 7000).onUpdate(xwikiLogoFreeRotate);

		tween.chain(tween1);
		tween1.chain(tween2);

		tween.start(0);

		/* Begin of XWiki text tween definition */

		xwikiTextPosition.x = -1000;
		xwikiTextPosition.y = 0;
		tween = new TWEEN.Tween(xwikiTextPosition).to({
			x : xwikiText.centerOffsetX,
			y : -400,
			z : 0,
			rx : -6.28,
			rz : 6.28,
			ry : 6.28
		}, 10500).delay(17000).onUpdate(xwikiTextUpdate);

		tween1 = new TWEEN.Tween(xwikiTextPosition).to({
			z : 1100,
			y : 0,
			rx : 3.14
		}, 7000).delay(11850).onUpdate(xwikiTextUpdate);

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

			camera = new THREE.PerspectiveCamera(75, params.screenWidth / params.screenHeight, 1, 10000);
			camera.position.z = 1000;
			scene.add(camera);

			xwikiLogo = getXWikiLogo();
			xwikiLogo.position.z = xwikiLogoPosition.z;
			scene.add(xwikiLogo);

			xwikiText = createText("XWiki", 0xcfcfcf, 120);
			xwikiText.mesh.position.x = xwikiTextPosition.x;
			xwikiText.mesh.position.y = xwikiTextPosition.y;
			xwikiText.mesh.position.z = xwikiTextPosition.z;
			scene.add(xwikiText.mesh);

			initialized = true;

			console.log(ID + " part initialized.");
		},

		start : function() {
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
