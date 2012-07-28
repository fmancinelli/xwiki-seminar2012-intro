var XWikiIntro = (function() {
	/*
	 * Constants.
	 */
	var REFRESH_RATE = 60; // Hz

	/*
	 * Internal variables.
	 */
	var storyboard = [];
	var renderer = null;
	var audio = null;
	var startTime = 0;
	var text = null;

	/*
	 * Functions.
	 */

	/*
	 * The main loop function. It draws the parts' frame that are active at a
	 * given time.
	 */
	function mainLoop() {
		/*
		 * Synch with audio time. Parts timing is in milliseconds, audio time is
		 * in seconds
		 */
		var _time = audio.currentTime * 1000;

		requestAnimationFrame(function() {
		});

		/*
		 * Go through all the storyboard parts, check what are the active ones,
		 * start them if they are not already started, and draw the
		 * corresponding frames.
		 */
		for ( var i = 0; i < storyboard.length; i++) {
			if (_time >= storyboard[i].startTime && _time < (storyboard[i].startTime + storyboard[i].endTime)) {
				part = storyboard[i].part;

				/*
				 * This is needed for initializing tweens used in different
				 * parts. Since Tween.js uses a global object, each part has to
				 * clear the tweens registered by the previous parts and add its
				 * own. It could be fine if parts are timed using global clock,
				 * but since they use a local one, they had at least to reset
				 * the tweens so that they start from time 0.
				 */
				if (!part.isStarted()) {
					part.start();
				}

				part.drawFrame({
					time : _time,
					localTime : _time - storyboard[i].startTime
				});
			}
		}
	}

	/*
	 * Add a part and initialize it.
	 */
	function addPart(_part, _startTime, _endTime, initParams) {
		_part.init(renderer, initParams);
		storyboard.push({
			part : _part,
			startTime : _startTime,
			endTime : _endTime
		});
	}

	/*
	 * Init audio.
	 */
	function initAudio() {
		audio = new Audio("audio/dope.mp3");
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
		addPart(BlueParticlesIntroPart, 0, 43000, {
			screenWidth : _screenWidth,
			screenHeight : _screenHeight
		});

		addPart(XWikiLogoPart, 43001, 46000, {
			screenWidth : _screenWidth,
			screenHeight : _screenHeight
		});

		addPart(XWikiSeminarPart, 89001, 33000, {
			screenWidth : _screenWidth,
			screenHeight : _screenHeight
		});

		addPart(WelcomePart, 122001, 60000, {
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
			initAudio();
			initThreeJS(screenId, screenWidth, screenHeight);
			initParts(screenWidth, screenHeight);
		},

		/*
		 * Start the intro.
		 */
		start : function() {
			/* Start the intro when the audio is loaded and ready to play. */
			audio.addEventListener('canplay', function() {
				audio.play();
				setInterval(mainLoop, 1000.0 / REFRESH_RATE);
			})
		}
	};

	return api;
})();
