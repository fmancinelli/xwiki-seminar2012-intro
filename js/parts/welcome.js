/* This part has been built starting from http://mrdoob.github.com/three.js/examples/webgl_materials_cubemap_balls_refraction.html */

var WelcomePart = (function() {
	/*
	 * Constants.
	 */
	var ID = "Welcome";

	/*
	 * Internal variables.
	 */
	var initialized = false;
	var started = false;
	var renderer = null;
	var composer = null;
	var scene = null;
	var sceneCube = null;
	var camera = null;
	var cameraCube = null;

	var welcomeText;

	/*
	 * State variable for camera position animation
	 */
	var cameraPosition = {
		x : 20000,
		y : 380
	}

	/*
	 * Initialize tweens for camera position movement.
	 */
	function initTweens() {
		tween = new TWEEN.Tween(cameraPosition).to({
			x : -20000,
			y : 400
		}, 10000);

		tween1 = new TWEEN.Tween(cameraPosition).to({
			x : 20000,
			y : -400
		}, 10000);

		tween.chain(tween1);
		tween1.chain(tween);

		tween.start(0);
	}

	/*
	 * Helper function to create text objects. By default it puts text's opacity
	 * to 0.0, making it invisible.
	 */
	function createText(text, _color, _size) {
		var text3d = new THREE.TextGeometry(text, {
			size : _size,
			height : 100,
			curveSegments : 2,
			font : "helvetiker"

		});

		text3d.computeBoundingBox();
		var centerOffsetX = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
		var centerOffsetY = -0.5 * (text3d.boundingBox.max.y - text3d.boundingBox.min.y);

		var _textMaterial = new THREE.MeshBasicMaterial({
			color : _color,
			overdraw : true,
			opacity : 0.8
		});
		text = new THREE.Mesh(text3d, _textMaterial);

		text.doubleSided = true;

		text.position.x = centerOffsetX;
		text.position.y = centerOffsetY;
		text.position.z = 0;

		text.rotation.x = 0;
		text.rotation.y = Math.PI * 2;

		parent = new THREE.Object3D();
		parent.add(text);

		return {
			textGeometry : text,
			textMaterial : _textMaterial
		};
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
			sceneCube = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(60, params.screenWidth / params.screenHeight, 1, 100000);
			camera.position.z = 3200;
			scene.add(camera);

			cameraCube = new THREE.PerspectiveCamera(60, params.screenWidth / params.screenHeight, 1, 100000);
			sceneCube.add(cameraCube);

			welcomeText = createText("welcome", 0xffffff, 800);
			scene.add(welcomeText.textGeometry);

			var path = "images/";
			var format = '.jpg';
			var urls = [ path + 't1' + format, path + 't3' + format, path + 'ny' + format, path + 'ny' + format,
					path + 'ny' + format, path + 't2' + format ];

			var textureCube = THREE.ImageUtils.loadTextureCube(urls)

			var shader = THREE.ShaderUtils.lib["cube"];
			shader.uniforms["tCube"].texture = textureCube;

			var material = new THREE.ShaderMaterial({
				fragmentShader : shader.fragmentShader,
				vertexShader : shader.vertexShader,
				uniforms : shader.uniforms,
				depthWrite : false
			});

			var mesh = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), material);
			mesh.flipSided = true;
			sceneCube.add(mesh);

			initialized = true;

			console.log(ID + " part initialized.");
		},

		start : function() {
			initTweens();

			/*
			 * Autoclear should be explicitly set for each part in the start
			 * function in order to be sure that it is correctly initialized.
			 */
			renderer.autoClear = false;

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

			camera.position.x = cameraPosition.x;
			camera.position.y = cameraPosition.y;
			camera.lookAt(scene.position);
			cameraCube.rotation.copy(camera.rotation);
			welcomeText.textGeometry.rotation.copy(camera.rotation);

			renderer.render(sceneCube, cameraCube);
			renderer.render(scene, camera);
		}
	}

	return api;
})();
