var BlueParticlesIntroPart = (function() {
	/** Constants */
	var ID = "Blue particles";

	/** Internal variables */
	var initialized = false;
	var renderer = null;
	var scene = null;
	var camera = null;
	var mesh = null;
	var sphere;

	/** Shader variables */
	var uniforms;
	var attributes;

	/** Tween, objects and animation state variables */
	var tween;

	var particlesOpacity = {
		value : 0.0
	}

	var yearText;
	var yearTextOpacity = {
		value : 0.0
	};
	var romaniaText;
	var romaniaTextOpacity = {
		value : 0.0
	};
	var tulceaText;
	var tulceaTextOpacity = {
		value : 0.0
	};

	/* Particle background initialization */
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
			opacity : {
				type : "f",
				value : 0.0
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

	/*
	 * Helper function to create text objects. By default it puts text's opacity
	 * to 0.0, making it invisible.
	 */
	function createText(text, _color, _size) {
		var text3d = new THREE.TextGeometry(text, {
			size : _size,
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
			color : _color,
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

	/* Initialize text objects */
	function initText() {
		yearText = createText("July 2012", 0xFFFFFF, 15);
		romaniaText = createText("Romania", 0xFFFFFF, 15);
		tulceaText = createText("Tulcea", 0xFFFFFF, 15);

		scene.add(yearText.textGeometry);
		scene.add(romaniaText.textGeometry);
		scene.add(tulceaText.textGeometry);
	}

	/* Initialize animation by buidling a sequence of tweens */
	function initTweens() {
		TWEEN.removeAll();

		particlesOpacityUpdate = function() {
			uniforms.opacity.value = particlesOpacity.value;
		};

		yearTextOpacityUpdate = function() {
			yearText.textMaterial.opacity = yearTextOpacity.value;
		};

		romaniaTextOpacityUpdate = function() {
			romaniaText.textMaterial.opacity = romaniaTextOpacity.value;
		};

		tulceaTextOpacityUpdate = function() {
			tulceaText.textMaterial.opacity = tulceaTextOpacity.value;
		};

		tween = new TWEEN.Tween({}).delay(2000);

		tween1 = new TWEEN.Tween(particlesOpacity).to({
			value : 1.0
		}, 9000).onUpdate(particlesOpacityUpdate);

		tween2 = new TWEEN.Tween(yearTextOpacity).to({
			value : 1.0
		}, 2000).onUpdate(yearTextOpacityUpdate);

		tween3 = new TWEEN.Tween({}).delay(1000);

		tween4 = new TWEEN.Tween(yearTextOpacity).to({
			value : 0.0
		}, 2000).onUpdate(yearTextOpacityUpdate);

		tween5 = new TWEEN.Tween({}).delay(500);

		tween6 = new TWEEN.Tween(romaniaTextOpacity).to({
			value : 1.0
		}, 2000).onUpdate(romaniaTextOpacityUpdate);

		tween7 = new TWEEN.Tween({}).delay(1000);

		tween8 = new TWEEN.Tween(romaniaTextOpacity).to({
			value : 0.0
		}, 2000).onUpdate(romaniaTextOpacityUpdate);

		tween9 = new TWEEN.Tween({}).delay(500);

		tween10 = new TWEEN.Tween(tulceaTextOpacity).to({
			value : 1.0
		}, 2000).onUpdate(tulceaTextOpacityUpdate);

		tween11 = new TWEEN.Tween({}).delay(6000);

		tween12 = new TWEEN.Tween(tulceaTextOpacity).to({
			value : 0.0
		}, 2000).onUpdate(tulceaTextOpacityUpdate);

		tween13 = new TWEEN.Tween(particlesOpacity).to({
			value : 0.0
		}, 5000).onUpdate(particlesOpacityUpdate);

		tween.chain(tween1);
		tween1.chain(tween2);
		tween2.chain(tween3);
		tween3.chain(tween4);
		tween4.chain(tween5);
		tween5.chain(tween6);
		tween6.chain(tween7);
		tween7.chain(tween8);
		tween8.chain(tween9);
		tween9.chain(tween10);
		tween10.chain(tween11);
		tween11.chain(tween12);
		tween12.chain(tween13);

		tween.start();
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
			initTweens();

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

			TWEEN.update();

			sphere.rotation.z = 0.005 * time;

			for ( var i = 0; i < attributes.size.value.length; i++) {
				attributes.size.value[i] = 14 + 13 * Math.sin(0.1 * i + time);
			}

			attributes.size.needsUpdate = true;

			renderer.render(scene, camera);
		}
	}

	return api;
})();
