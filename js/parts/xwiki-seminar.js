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
	var funWall = null;
	var futureWall = null;

	var counter = 1;

	function buildWall(texture, textureWidth, textureHeight, xgrid, ygrid, z) {
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
					map : texture
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
			camera.position.z = 1500;
			scene.add(camera);

			seminarWall = buildWall("images/seminar.png", 1024, 100, 10, 1, 0);
			scene.add(seminarWall);

			talksWall = buildWall("images/talks.png", 1024, 100, 10, 1, -1500);
			scene.add(talksWall);

			hackatonWall = buildWall("images/hackaton.png", 1024, 100, 10, 1,
					-3000);
			scene.add(hackatonWall);

			funWall = buildWall("images/fun.png", 1024, 100, 10, 1, -4500);
			scene.add(funWall);

			futureWall = buildWall("images/future.png", 1024, 100, 10, 1, -6000);
			scene.add(futureWall);

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

			camera.position.z -= 5;

			counter++;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
