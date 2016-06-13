SPLASH = {
	active: false,
	t0: new Date().getTime(),
	// replaceCount: 0,

	add: function() {
		var bodies = document.getElementsByTagName('body');
		// console.log('bodies', bodies.length);
		if (!bodies.length) return setTimeout(SPLASH.add, 5);
		SPLASH.screen = new Date().getTime();
		console.log('SPLASH.add', new Date().getTime() - SPLASH.t0, 'ms');
		var html = '';
		html += "<center id='splash-js' style='background:#333;position:absolute;top:0;left:0;width:100%;height:100%;'>";
		html += "<img src='bin/icon.png' style='margin-top: 20%; width: 256px;'/>";
		html += "<h1 style='color:white; margin-top:10%;'>Weather Charts</h1>";
		html += "</center>";
		document.getElementsByTagName('body')[0].innerHTML += html;
		SPLASH.active = true;
		SPLASH.replaceLinks();
	},
	del: function() {
		var tmp = document.getElementById('splash-js');
		// if (tmp) tmp.parentNode.removeChild(tmp);
		if (!tmp) return;
		tmp.parentNode.removeChild(tmp);
		console.log('SPLASH.del', new Date().getTime() - SPLASH.t0, 'ms', document.getElementById('splash-js'));
		SPLASH.screen = new Date().getTime() - SPLASH.screen;
		console.log('SPLASH.screen', SPLASH.screen, 'ms');
	},

	replaceJS: function(el, load) {
		var script = document.createElement("script");
		script.setAttribute('src', load);
		// if (el.hasAttribute('defer')) script.setAttribute('defer', true);
		el.parentNode.replaceChild(script, el);
	},

	replaceHTML: function(el, load) {
		var link = document.createElement("link");
		link.setAttribute('rel', 'import');
		link.setAttribute('href', load);
		el.parentNode.replaceChild(link, el);
	},

	replaceLinks: function() {
		if (!SPLASH.active) return;
		// console.log('SPLASH.replaceLinks');
		if (new Date().getTime() - SPLASH.t0 < 10000)
			setTimeout(SPLASH.replaceLinks, 100);
		var links = document.getElementsByTagName('link');
		for (var i = 0; i < links.length; i++) {
			var load = links[i].getAttribute('load');
			if (!load) continue;
			console.log('SPLASH.replace', new Date().getTime() - SPLASH.t0, 'ms', links[i]);
			if (load.substr(-3) == '.js') SPLASH.replaceJS(links[i], load);
			if (load.substr(-5) == '.html') SPLASH.replaceHTML(links[i], load);
		}
	},
}

console.log('SPLASH.start');
SPLASH.add();
// setInterval(SPLASH.replaceLinks, 100);



// console.time('WebComponentsReady');
// window.addEventListener('WebComponentsReady', function(e) {
// 	console.timeEnd('WebComponentsReady');
// });
// console.time('DOMContentLoaded');
// document.addEventListener("DOMContentLoaded", function(event) {
// 	console.timeEnd('DOMContentLoaded');
// });
// console.time('window.onload');
// window.addEventListener('window.onload', function(e) {
// 	console.timeEnd('window.onload');
// });
// -------------
// -------------
// -------------
// console.time('ready');
// document.addEventListener('ready', function(e) {
// 	console.timeEnd('ready');
// });


// console.time('splash.js');

// console.log('splash.js: ADD', bodies);
// // console.log('addSplashScreen', document.getElementsByTagName('body'));
// var center = document.createElement('center');
// center.setAttribute('id', 'splash-js');
// center.setAttribute('style', 'background:red;position:absolute;top:0;left:0;width:100%;height:100%;');
// document.getElementsByTagName('body')[0].appendChild(center);
// var img = document.createElement('img');
// img.setAttribute('src', 'bin/icon.png');
// img.setAttribute('style', 'width:192px; margin-top:20%;');
// center.appendChild(img);
// var h1 = document.createElement('h1');
// h1.innerHTML = 'Weather Charts';
// h1.setAttribute('style', 'color: white; margin-top:10%;');
// center.appendChild(h1);



// window.addEventListener('ready', addSplashScreen);