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
	var mesh = null;

	/** *********** */
	var texture, material, mesh, wall;


	var cube_count,

	meshes = [], materials = [],

	xgrid = 20, ygrid = 2;

	var counter = 1;

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

	function buildWall(texture, xgrid, ygrid) {

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
			renderer.setClearColorHex(0xffff00, 1.0);

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(50, params.screenWidth
					/ params.screenHeight, 1, 10000);
			camera.position.z = 1500;
			scene.add(camera);

			texture = THREE.ImageUtils.loadTexture("images/seminar.png");

			var i, j, ux, uy, ox, oy, geometry, xsize, ysize;

			ux = 1 / xgrid;
			uy = 1 / ygrid;

			xsize = 1024 / xgrid;
			ysize = 100 / ygrid;

			cube_count = 0;

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
					materials[cube_count] = material;

					mesh = new THREE.Mesh(geometry, material);

					mesh.position.x = (i - xgrid / 2) * xsize;
					mesh.position.y = -(j - ygrid / 2) * ysize;
					mesh.position.z = 0;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

					mesh.dx = 0.02 * (Math.random());
					mesh.dy = 0.04 * (0.5 - Math.random());

					meshes[cube_count] = mesh;

					cube_count += 1;

					wall.add(mesh);
				}

			scene.add(wall);

			renderer.autoClear = false;

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
			
			if (counter > 100) {

				for (i = 0; i < cube_count; i++) {

					mesh = meshes[i];

					mesh.rotation.x += 10 * mesh.dx;
					mesh.rotation.y += 10 * mesh.dy;

					mesh.position.x += 200 * mesh.dx;
					mesh.position.y += 200 * mesh.dy;
					mesh.position.z += 400 * mesh.dx;

				}

			}

			camera.position.z -= 5;

			counter++;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
