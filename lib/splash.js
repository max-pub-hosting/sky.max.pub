addSplashScreen = function() {
	console.time('splash.js');
	console.log('body', document.getElementsByTagName('body'));
	console.log('addSplashScreen', document.getElementsByTagName('body'));
	var center = document.createElement('center');
	center.setAttribute('id', 'splash-js');
	center.setAttribute('style', 'background:red;position:absolute;top:0;left:0;width:100%;height:100%;');
	document.getElementsByTagName('body')[0].appendChild(center);
	var img = document.createElement('img');
	img.setAttribute('src', 'bin/icon.png');
	center.appendChild(img);
	// var html = '';
	// html += "<center id='splash-js' style='background:#333;position:absolute;top:0;left:0;width:100%;height:100%;'>";
	// html += "<img src='bin/icon.png' style='margin-top: 20%;'/>";
	// html += "<h1 style='color:white; margin-top:10%;'>Weather Charts</h1>";
	// html += "</center>";
	// document.getElementsByTagName('body')[0].innerHTML += html;
}

document.addEventListener("DOMContentLoaded", function(event) {
	addSplashScreen();
});

window.addEventListener('WebComponentsReady', function(e) {
	// return;
	// alert('hide splash screen now');
	// console.log("WebComponentsReady! hide splash-screen now", e);
	console.timeEnd('splash.js');
	var tmp = document.getElementById('splash-js');
	if (tmp) tmp.parentNode.removeChild(tmp);
});

// window.addEventListener('ready', addSplashScreen);