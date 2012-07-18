var Utils = (function() {
	var textArea = null;

	function getTextArea() {
		if (textArea == null) {
			textArea = document.getElementById("text");
		}

		return textArea;
	}

	/**
	 * Public API
	 */
	var api = {
		write : function(message) {
			getTextArea().innerText = message;
		},
	};

	return api;
})();
