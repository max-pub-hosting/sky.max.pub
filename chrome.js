chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'innerBounds': {
			'width': 400,
			'height': 700,
			'minWidth': 300,
			'maxWidth': 500,
		},
		'frame': 'none'
	});
});