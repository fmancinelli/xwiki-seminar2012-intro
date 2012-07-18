var XWikiSeminarPart = (function() {
	/**
	 * Constants.
	 */
	var ID = "XWiki seminar";

	/**
	 * Internal variables.
	 */
	var initialized = false;
	var started = false;
	var renderer = null;
	var scene = null;
	var camera = null;

	var seminarWall = null;
	var talksWall = null;
	var hackatonWall = null;
	var futureWall = null;

	var wallsOpacity = {
		value : 0.0
	};

	var cameraPosition = {
		z : 1500
	}

	var counter = 1;

	function buildWall(texture, textureWidth, textureHeight, xgrid, ygrid, z,
			_opacity) {
		function change_uvs(geometry, unitx, unity, offsetx, offsety) {
			var i, j, uv;

			for (i = 0; i < geometry.faceVertexUvs[0].length; i++) {
				uv = geometry.faceVertexUvs[0][i];

				for (j = 0; j < uv.length; j++) {
					uv[j].u = (uv[j].u + offsetx) * unitx;
					uv[j].v = (uv[j].v + offsety) * unity;
				}
			}
		}

		var i, j, ux, uy, ox, oy, geometry, xsize, ysize, mesh, texture;

		texture = THREE.ImageUtils.loadTexture(texture);

		ux = 1 / xgrid;
		uy = 1 / ygrid;

		xsize = textureWidth / xgrid;
		ysize = textureHeight / ygrid;

		wall = new THREE.Object3D();

		for (i = 0; i < xgrid; i++)
			for (j = 0; j < ygrid; j++) {

				ox = i;
				oy = j;

				geometry = new THREE.CubeGeometry(xsize, ysize, xsize);
				change_uvs(geometry, ux, uy, ox, oy);

				material = new THREE.MeshBasicMaterial({
					map : texture,
					opacity : _opacity
				});

				mesh = new THREE.Mesh(geometry, material);

				mesh.position.x = (i - xgrid / 2) * xsize;
				mesh.position.y = -(j - ygrid / 2) * ysize;
				mesh.position.z = 0;

				mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

				mesh.dx = 0.02 * (Math.random());
				mesh.dy = 0.04 * (0.5 - Math.random());

				wall.add(mesh);
			}

		wall.position.z = z;

		return wall;
	}

	function initTweens() {
		function wallsOpacityUpdate() {
			for (i = 0; i < seminarWall.children.length; i++) {
				cube = seminarWall.children[i];
				cube.material.opacity = wallsOpacity.value;
			}

			for (i = 0; i < talksWall.children.length; i++) {
				cube = talksWall.children[i];
				cube.material.opacity = wallsOpacity.value;
			}

			for (i = 0; i < hackatonWall.children.length; i++) {
				cube = hackatonWall.children[i];
				cube.material.opacity = wallsOpacity.value;
			}

			for (i = 0; i < futureWall.children.length; i++) {
				cube = futureWall.children[i];
				cube.material.opacity = wallsOpacity.value;
			}
		}

		function cameraPositionUpdate() {
			camera.position.z = cameraPosition.z;
		}

		function wallExplosionUpdate(wall) {
			return function() {
				for (i = 0; i < wall.children.length; i++) {
					cube = wall.children[i];

					cube.rotation.x += 10 * cube.dx;
					cube.rotation.y += 10 * cube.dy;

					cube.position.x += 200 * cube.dx;
					cube.position.y += 200 * cube.dy;
					cube.position.z += 400 * cube.dx;
				}
			}
		}

		TWEEN.removeAll();

		tween = new TWEEN.Tween(wallsOpacity).to({
			value : 1.0
		}, 12100).delay(1100).onUpdate(wallsOpacityUpdate);

		cameraTween = new TWEEN.Tween(cameraPosition).to({
			z : 800
		}, 4000).delay(13200).onUpdate(cameraPositionUpdate);

		cameraTween1 = new TWEEN.Tween(cameraPosition).to({
			z : -700
		}, 4000).onUpdate(cameraPositionUpdate);

		cameraTween2 = new TWEEN.Tween(cameraPosition).to({
			z : -2200
		}, 4000).onUpdate(cameraPositionUpdate);

		cameraTween3 = new TWEEN.Tween(cameraPosition).to({
			z : -3700
		}, 4000).onUpdate(cameraPositionUpdate);
		
		/* Go towards the last wall so that all debris will out of screen. */
		cameraTween4 = new TWEEN.Tween(cameraPosition).to({
			z : -4500
		}, 8000).onUpdate(cameraPositionUpdate);

		cameraTween.chain(cameraTween1);
		cameraTween1.chain(cameraTween2);
		cameraTween2.chain(cameraTween3);
		cameraTween3.chain(cameraTween4);

		seminarExplosionTween = new TWEEN.Tween({}).to({}, 3900).delay(17100)
				.onUpdate(wallExplosionUpdate(seminarWall));

		talksExplosionTween = new TWEEN.Tween({}).to({}, 3900).onUpdate(
				wallExplosionUpdate(talksWall));

		hackatonExplosionTween = new TWEEN.Tween({}).to({}, 3900).onUpdate(
				wallExplosionUpdate(hackatonWall));

		futureExplosionTween = new TWEEN.Tween({}).to({}, 3900).onUpdate(
				wallExplosionUpdate(futureWall));
	
		seminarExplosionTween.chain(talksExplosionTween);
		talksExplosionTween.chain(hackatonExplosionTween);
		hackatonExplosionTween.chain(futureExplosionTween);

		tween.start(0);
		cameraTween.start(0);
		seminarExplosionTween.start(0);
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

			camera = new THREE.PerspectiveCamera(50, params.screenWidth
					/ params.screenHeight, 1, 10000);
			camera.position.z = cameraPosition.z;
			scene.add(camera);

			seminarWall = buildWall("images/seminar.png", 1024, 100, 10, 1, 0,
					wallsOpacity.value);
			scene.add(seminarWall);

			talksWall = buildWall("images/talks.png", 1024, 100, 10, 1, -1500,
					wallsOpacity.value);
			scene.add(talksWall);

			hackatonWall = buildWall("images/hackaton.png", 1024, 100, 10, 1,
					-3000, wallsOpacity.value);
			scene.add(hackatonWall);

			futureWall = buildWall("images/future.png", 1024, 100, 10, 1,
					-4500, wallsOpacity.value);
			scene.add(futureWall);

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

			// if (counter > 100) {
			// for (i = 0; i < wall.children.length; i++) {
			// cube = wall.children[i];
			//
			// cube.rotation.x += 10 * cube.dx;
			// cube.rotation.y += 10 * cube.dy;
			//
			// cube.position.x += 200 * cube.dx;
			// cube.position.y += 200 * cube.dy;
			// cube.position.z += 400 * cube.dx;
			//
			// }
			// }

			// camera.position.z -= 5;

			// counter++;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
