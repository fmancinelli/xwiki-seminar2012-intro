var BlueParticlesPart = (function() {
	/**
	 * Constants.
	 */
	var ID = "Blue particles";

	/**
	 * Internal variables.
	 */
	var initialized = false;
	var renderer = null;
	var scene = null;
	var camera = null;
	var mesh = null;
	var sphere;
	var uniforms;
	var attributes;
	
	var hello;
	var year;

	function initParticles() {
		attributes = {

			size : {
				type : 'f',
				value : []
			},
			customColor : {
				type : 'c',
				value : []
			}

		};

		uniforms = {
			amplitude : {
				type : "f",
				value : 1.0
			},
			color : {
				type : "c",
				value : new THREE.Color(0xffffff)
			},
			texture : {
				type : "t",
				value : 0,
				texture : THREE.ImageUtils.loadTexture("images/spark1.png")
			},
		};

		var shaderMaterial = new THREE.ShaderMaterial(
				{
					uniforms : uniforms,
					attributes : attributes,
					vertexShader : document.getElementById('vertexshader').textContent,
					fragmentShader : document.getElementById('fragmentshader').textContent,

					blending : THREE.AdditiveBlending,
					depthTest : false,
					transparent : true
				});

		var radius = 200;
		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 100000; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			vertex.multiplyScalar(radius);

			geometry.vertices.push(vertex);
		}

		sphere = new THREE.ParticleSystem(geometry, shaderMaterial);
		sphere.dynamic = true;

		var vertices = sphere.geometry.vertices;
		var values_size = attributes.size.value;
		var values_color = attributes.customColor.value;

		for ( var v = 0; v < vertices.length; v++) {
			values_size[v] = 10;
			values_color[v] = new THREE.Color(0x0086cb);
			values_color[v].setHSV(0.5 + 0.1 * (v / vertices.length), 0.7, 0.9);
		}

		scene.add(sphere);
	}

	function createText(text) {
		var text3d = new THREE.TextGeometry(text, {
			size : 10,
			height : 10,
			curveSegments : 2,
			font : "helvetiker"

		});

		text3d.computeBoundingBox();
		var centerOffsetX = -0.5
				* (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
		var centerOffsetY = -0.5
				* (text3d.boundingBox.max.y - text3d.boundingBox.min.y);

		var _textMaterial = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			overdraw : true,
			opacity : 0.0
		});
		text = new THREE.Mesh(text3d, _textMaterial);

		text.doubleSided = false;

		text.position.x = centerOffsetX;
		text.position.y = centerOffsetY;
		text.position.z = 0;

		text.rotation.x = 0;
		text.rotation.y = Math.PI * 2;

		parent = new THREE.Object3D();
		parent.add(text);

		return {
			textGeometry : parent,
			textMaterial : _textMaterial
		};
	}
	
	function initText() {
		hello = createText("Hello");
		year = createText("Year");
		
		scene.add(hello.textGeometry);
		scene.add(year.textGeometry);
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

			camera = new THREE.PerspectiveCamera(40, params.screenWidth
					/ params.screenHeight, 1, 10000);
			camera.position.z = 300;

			scene = new THREE.Scene();

			scene.add(camera);

			initParticles();
			initText();


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

			var time = params.time * 0.005;
			hello.textMaterial.opacity = Math.sin(time);

			sphere.rotation.z = 0.01 * time;

			for ( var i = 0; i < attributes.size.value.length; i++) {
				attributes.size.value[i] = 14 + 13 * Math.sin(0.1 * i + time);
			}

			attributes.size.needsUpdate = true;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
