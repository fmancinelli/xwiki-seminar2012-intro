var XWikiIntro = (function() {
	/**
	 * Constants.
	 */
	var REFRESH_RATE = 60; // Hz

	/**
	 * Internal variables.
	 */
	var storyboard = [];
	var renderer = null;
	var startTime = 0;

	/**
	 * Functions.
	 */

	/*
	 * The main loop function. It draws the parts' frame that are active at a
	 * given time.
	 */
	function mainLoop() {
		_time = (new Date()).getTime() - startTime;

		for (i = 0; i < storyboard.length; i++) {
			if (_time >= storyboard[i].startTime
					&& _time < storyboard[i].endTime) {
				part = storyboard[i].part;
				part.drawFrame({
					time : _time
				});
			}
		}
	}

	/*
	 * Add a part after and initialize it.
	 */
	function addPart(_part, params) {
		_part.init(renderer, params);
		storyboard.push({
			part : _part,
			startTime : 0,
			endTime : 3000
		});
	}

	/*
	 * Initialization function for Three.js
	 */
	function initThreeJS(screenId, screenWidth, screenHeight) {
		renderer = new THREE.WebGLRenderer({
			clearColor : 0x000000,
			clearAlpha : 1
		});
		renderer.setSize(screenWidth, screenHeight);

		container = document.getElementById(screenId);
		container.appendChild(renderer.domElement);
	}

	/*
	 * Initialize all the intro's parts. This is where the "storyboard" of the
	 * intro is defined.
	 */
	function initParts(_screenWidth, _screenHeight) {
		addPart(TestPart, {
			screenWidth : _screenWidth,
			screenHeight : _screenHeight
		});
	}

	/**
	 * Public API
	 */
	var api = {
		/*
		 * Initialize the intro.
		 */
		init : function(screenId, screenWidth, screenHeight) {
			initThreeJS(screenId, screenWidth, screenHeight);
			initParts(screenWidth, screenHeight);
		},

		/*
		 * Start the intro.
		 */
		start : function() {
			startTime = (new Date()).getTime();
			setInterval(mainLoop, 1000.0 / REFRESH_RATE);
		}
	};

	return api;
})();
