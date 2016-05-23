addSplashScreen = function() {
	console.log('addSplashScreen', document.getElementsByTagName('body'));
	var html = '';
	html += "<center id='splash-js' style='background:#333;position:absolute;top:0;left:0;width:100%;height:100%;'>";
	html += "<img src='bin/icon.png' style='margin-top: 20%;'/>";
	html += "<h1 style='color:white; margin-top:10%;'>Weather Charts</h1>";
	html += "</center>";
	document.getElementsByTagName('body')[0].innerHTML += html;
}
addSplashScreen();

window.addEventListener('WebComponentsReady', function(e) {
	// alert('hide splash screen now');
	console.log("WebComponentsReady! hide splash-screen now", e);
	var tmp = document.getElementById('splash-js');
	tmp.parentNode.removeChild(tmp);
});

// window.addEventListener('ready', addSplashScreen);
Polymer({
        is: "hash-route",
        properties: {
            regex: {
                type: String,
                observer: 'urlChange'
            },
            mode: {
                type:String,
                value: 'css'
            },
            p1:{ notify: true },
            p2:{ notify: true },
            p3:{ notify: true },
            p4:{ notify: true },
            p5:{ notify: true },
        },

        ready: function () {
            this.DOM = true;
            this.hide();
            window.addEventListener('hashchange',this.match.bind(this));
            this.match(); // is there another way??
        },
        show: function(){
            if(this.mode.toLowerCase()=='dom') this.DOM = true;
            this.hidden = false;
            // console.log("HASH",this.regex,this.DOM);
        },
        hide: function(){
            if(this.mode.toLowerCase()=='dom') this.DOM = false;
            this.hidden = true;
            // console.log("HASH",this.regex,this.DOM);
        },
        urlChange: function(event){
            this.match();
        },
        match: function(){
            var hash = document.location.hash;
            if(hash[0]==='#') hash = hash.substr(1);
            if(hash[0]==='!') hash = hash.substr(1);
            var regex = new RegExp('^'+this.regex+'$');
            var match = hash.match(regex);
            if(match) {
                this.set('p1',match[1]);
                this.set('p2',match[2]);
                this.set('p3',match[3]);
                this.set('p4',match[4]);
                this.set('p5',match[5]);
            }
            if(match) this.show();
            else this.hide();
            // this.hidden = match ? false : true;
            // if(match) console.log('HASH-ROUTE match:', hash, regex);
        }
    });
KEYJS = {
	pressed: [],
	commandKeys: {
		8: 'backspace',
		9: 'tab',
		13: 'enter',
		16: 'shift',
		17: 'ctrl',
		18: 'alt',
		27: 'esc',
		32: 'space',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		91: 'cmd',
		93: 'cmd'
	},
	keyName: function(n) {
		if (KEYJS.commandKeys[n]) return KEYJS.commandKeys[n]
		else return String.fromCharCode(n).trim().toLowerCase();
	},

	actions: {},
	act: function() {
		var f = KEYJS.actions[KEYJS.pressed.sort().join(' ')];
		// console.log('act', f, KEYJS.pressed.sort().join(' '));
		if (f) console.log('KEY.js action:', KEYJS.pressed.sort().join(' '));
		if (f) f();
	}
};

document.addEventListener('keydown', function(ev) {
	var key = KEYJS.keyName(ev.which);
	if (KEYJS.pressed.indexOf(key) != -1) return;
	KEYJS.pressed.push(key);
	// console.log('KEY.js pressed:', KEYJS.pressed);
	KEYJS.act();
});
document.addEventListener('keyup', function(ev) {
	var key = KEYJS.keyName(ev.which);
	var index = KEYJS.pressed.indexOf(key);
	if (index > -1)
		KEYJS.pressed.splice(index, 1);
	// console.log('KEY.js pressed:', KEYJS.pressed);
});

KEY = function(keys, callback) {
	keys = keys.split(' ').sort().join(' ');
	return {
		then: function(callback) {
			console.log("KEY.js register:", keys);
			KEYJS.actions[keys] = callback;
		}
	};
};
Polymer({
        is: "hash-key",
        properties: {
            key: {
                type: String,
                observer: 'keyChange'
            },
            hash: {
                type: String,
                observer: 'hashChange'
            }
        },
        keyChange: function (old, now) {
            KEY(old).then(0);
            KEY(this.key).then(this.setHash.bind(this));
            // KEY(this.key).then(function(ev){
            //     document.location.hash = '#' + this.hash;
            // }.bind(this));
        },
        hashChange: function(){
            KEY(this.key).then(this.setHash.bind(this));
            // KEY(this.key).then(function(ev){
            // document.location.hash = '#' + this.hash;
            // }.bind(this));
        },
        setHash: function(){
            document.location.hash = '#' + this.hash;
            // if(this.hash) document.location.hash = '#' + this.hash;
            // else document.location.hash = '';
        }
    });
Polymer({
        is: "close-app",
        properties: {
        },
        listeners: {
            'tap': 'tap',
        },
        ready: function(){
            this.hidden = true;
            if('chrome' in window) 
                if('app' in chrome)
                    if('window' in chrome.app)
                        this.hidden = false;
            // if(!chrome.app.window) this.hidden = true;
        },
        tap: function () {
            alert('close');
            chrome.app.window.current().close();
        },
    });

/*        button{
            float: right;
            color: white;
            font-weight: bold;
            font-size: 20px;
            font-size: 25px;
            background: transparent;
            -webkit-border-radius: 100px;
            border: 2px solid white;
            border: none;
            display: inline-block;
            width: 36px;
            height: 36px;
            margin: 5px;
        }
        button:hover{
            color: silver;
            border-color: silver;
        }
*/
Polymer({
        is: "week-title",
        properties:{
            lat:{
                type: Number,
                observer: 'change'
            },
            lon:{
                type: Number,
                observer: 'change'
            },
        },
        change: function(){
            this.set('place',null);
            if(!this.lat) return;
            if(!this.lon) return;
            this.debounce('search', function(){
                STORE.get(this.lat+','+this.lon+' city', function(name){
                    if(name) this.set('place',name);
                    else{
                        GEO.search(this.lat+','+this.lon, function(result){
                            console.log('week-header search',result);
                            var p = result[0];
                            this.set('place',p);
                            // STORE.set(p.lat.toFixed(2)+','+p.lon.toFixed(2)+' city', p);
                            setLocation(p.lat, p.lon);
                            // document.location.hash = '#' + p.lat.toFixed(2)+'#'+p.lon.toFixed(2);
                        }.bind(this), {type:'city'});
                    }
                }.bind(this));
            }.bind(this), 100);
        },
        back: function(){
            document.location.hash='';
        }
    });
Polymer({
            is: 'geo-search',
            properties: {
                query: {
                    type: String,
                    observer: 'doSearch'
                },
                result: {
                    type: Object,
                    notify: true
                },
                first: {
                    type: Object,
                    notify: true
                }
            },
            ready: function () {
                // bb = this;
            },
            doSearch: function () {
                GEO.search(this.query, function (result) {
                    this.set('result', result);
                    if(result) this.set('first', result[0]);
                    this.fire('change', result);
                }.bind(this));
            }

        });
Polymer({
        is: "week-data",
        properties: {
            lat:{
                type: Number,
                observer: 'change'
            },
            lon:{
                type: Number,
                observer: 'change'
            },
            days:{
                type: Object,
                notify: true
            },
            sections:{
                type: Object,
                notify: true
            }
        },

        ready: function () {
        },

        change: function(){
            this.set('days',null);
            this.set('sections',null);
            if(!this.lat) return;
            if(!this.lon) return;

            this.debounce('search', function(){
                this.loadCache();
                this.loadFresh();
            }.bind(this), 100);
        },

        loadCache: function(){
            // console.log('store-get',this.lat,this.lon);
            STORE.get(this.lat+','+this.lon+' days', function(days){
                if(!days) return;
                this.set('days', days);
                this.set('sections', this.convertDaysToSections(days));
            }.bind(this));
        },

        loadFresh: function(){
            GEO.ajax('http://api.max.pub/weather/?range=days&lat=' + this.lat + '&lon=' + this.lon, function(days) {
                days = JSON.parse(days);
                this.set('days', days);
                this.set('sections', this.convertDaysToSections(days));
                STORE.set(this.lat+','+this.lon+' days', days);
            }.bind(this));
        },

        convertDaysToSections: function(DAYS) {
            var SECTIONS = {
                temperature: [],
                precipitation: [],
                wind: [],
                light: [],
                cloudCover: [],
                moon: [],
                pressure: [],
                humidity: [],
                ozone: [],
                days: []
            };
            for (day in DAYS) {
                var d = DAYS[day];
                SECTIONS.days.push(d.day);
                SECTIONS.temperature.push(d.temperature);
                SECTIONS.light.push(d.light);
                SECTIONS.precipitation.push(d.precipitation);
                SECTIONS.wind.push(d.wind);
                SECTIONS.moon.push(d.moon);
                SECTIONS.cloudCover.push(d.cloudCover);

                // SECTIONS.humidity.push(d.humidity);
                SECTIONS.humidity.push(Math.round(d.humidity * 100));
                SECTIONS.ozone.push(Math.round(d.ozone));
                SECTIONS.pressure.push(Math.round(d.pressure));
            }
            return SECTIONS;
        }

    });
Polymer({
        is: "rain-bucket",
        properties: {
            data: Array,
            labels: Array
        },

        value: function (item) {
            return Math.round(item.probability * 100);
        },
        drops: function (item) {
            return new Array(Math.round(item.probability * 100 / 5));
        },
        leftDrops: function (item) {
            return new Array(Math.ceil(Math.round(item.probability * 100 / 5) / 2));
        },
        rightDrops: function (item) {
            return new Array(Math.floor(Math.round(item.probability * 100 / 5) / 2));
        },
        image: function (item) {
            //            console.log('------------type', item);
            return 'bin/' + item.type + '.png';
        }

    });
Polymer({
        is: "cloud-cover",
        properties: {
            data: Array,
            labels: Array
        },

        value: function (data) {
            return Math.round(data * 100);
        },
        reversePercent: function (data) {
            return (1 - data);
        }

    });
Polymer({
        is: "wind-speed",
        properties: {
            data: Array,
            labels: Array
        },
        size: function (value) {
            //            console.log('size', value)
            return Math.round(value * 3.6); // m/s -> km/h
        },
        value: function (value) {
            return Math.round(value * 3.6);
        }
    });
Polymer({
        is: "moon-phase",
        properties: {
            data: Array,
            labels: Array
        },

        created: function () {},
        ready: function () {
            //            console.log('rain-prob', data);
        },
        left: function (phase, full) {
            return phase <= 0.5 ? 0 : full * 100;
        },
        right: function (phase, full) {
            return phase >= 0.5 ? 0 : full * 100;
        },
        percent: function (value) {
            return Math.round(value * 100);
        }

    });
Polymer({
        is: "day-light",
        properties: {
            data: Array,
            labels: Array
        },

        created: function () {},
        ready: function () {
            //            console.log('rain-prob', data);
        },
        hour: function (val) {
            return val.split(":")[0];
        },
        minute: function (val) {
            return val.split(":")[1];
        },
        length: function (val) {
            return this.hour(val) * 60 + this.minute(val) * 1;
        },
        baseBar: function (item) { // return shortest amount of light in the week
            var durations = [];
            for (var i = 0; i < this.data.length; i++)
                durations.push(this.length(this.data[i].duration));
            //            console.log('durations', Math.round(Math.min.apply(0, durations) / 5), durations);
            return Math.round(Math.min.apply(0, durations) / 12);
        },
        changeBar: function (item) {
            return Math.round((this.length(item.duration) - this.baseBar() * 12) * 2);
        }

    });

    //            var first = Math.abs(this.data[0].sunrise - this.data[0].sunset);
    //            return Math.round(first / 60 / 60 * 5);

    //            var first = Math.abs(this.data[0].sunrise - this.data[0].sunset);
    //            var diff = Math.abs(item.sunrise - item.sunset);
    //            return Math.round(Math.abs(diff - first) / 20);

    //        time: function (value) {
    //            var t = new Date(value * 1000);
    //            console.log('light-time', t);
    //            return t.getHours() + ':' + ("0" + t.getMinutes()).slice(-2);
    //            //            return {
    //            //                hours: t.getHours(),
    //            //                minutes: ("0" + t.getMinutes()).slice(-2);
    //            //            };
    //
    //        },
    //        timeH: function (val) {
    //            return this.time(val).split(':')[0];
    //        },
    //        timeM: function (val) {
    //            return this.time(val).split(':')[1];
    //        },
    //        diff: function (val1, val2) {
    //            var diff = Math.abs(val1 - val2);
    //            var hours = Math.floor(diff / 60 / 60);
    //            diff -= hours * 60 * 60;
    //            var minutes = Math.floor(diff / 60);
    //            return hours + ':' + ("0" + minutes).slice(-2);
    //            //            return {
    //            //                hours: hours,
    //            //                minutes: minutes
    //            //            };
    //        },
    //        diffH: function (v1, v2) {
    //            return this.diff(v1, v2).split(':')[0];
    //        },
    //        diffM: function (v1, v2) {
    //            return this.diff(v1, v2).split(':')[1];
    //        },

    //            var last = Math.abs(this.data.slice(-1)[0].sunrise - this.data.slice(-1)[0].sunset);
    //            console.log('first', first, last, last - first);
    //            var tmp = this.diff(item.sunrise, item.sunset);
    //            tmp = tmp.split(':');
    //            return Math.round(((tmp[0] * 60 + tmp[1] * 1) - 400) / 2 / 1);
    //            return Math.round(((tmp[0] * 60 + tmp[1] * 1) - 0) / 2 / 5);
Polymer({
        is: "temperature-range",
        properties: {
            data: {
                type: Array,
                observer: 'dataChange'
            },
            labels: Array
        },


        dataChange: function () {
            // console.log("TEMPERATURE CHANGE",this.data);
            this.unit = 'Celsius';
            if(!this.data) return;
            for (var i = 0; i < this.data.length; i++) {
                this.data[i].min = this.data[i].real.min;
                this.data[i].max = this.data[i].real.max;
            }
            this.setBase();
        },

        value: function (value) {
            return Math.round(value);
        },

        // size...
        setBase: function () {
            var base = 100;
            for (var i = 0; i < this.data.length; i++)
                if (this.data[i].min < base) base = this.data[i].min;
                //            console.log('MIN', base);
            this.base = base;
            //            return base;
        },
        baseBar: function (item) {
            return Math.abs(item.min - this.base) * 10;
        },
        tempBar: function (item) {
            // return Math.abs(item.max - item.min) * 10;
            return Math.abs(item.max - item.min) * 8;
        },


        // coloring...
        color: function (value) {
            // if (value > 0) return (50 - value);
            // else return 200 - value;
            if (value > 0) return (40 - value);
            else return 180 - value;
        },
        opacity: function (value) {
            return 1;
            if (value > 0) return (1 - ((50 - value) / 200));
            else return (0.75 + (-value / 200));
        },
        intensity: function (value) {
            //            return 1;
            if (value > 0) return 50 + Math.round((50 - value) / 2);
            else return 75 - Math.round(-value / 2);
        },
        hsla: function (value) {
            return "hsla(" + this.color(value) + ",100%," + this.intensity(value) + "%," + this.opacity(value) + ")";
        }

    });
Polymer({
        is: "humi-dity",
        properties: {
            data: Array,
            labels: Array
        },
        value: function (value) {
            return Math.round(value *100);
        }
    });
/* Chartist.js 0.9.5
 * Copyright © 2015 Gion Kunz
 * Free to use under the WTFPL license.
 * http://www.wtfpl.net/
 */

!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.Chartist=b()}):"object"==typeof exports?module.exports=b():a.Chartist=b()}(this,function(){var a={version:"0.9.5"};return function(a,b,c){"use strict";c.noop=function(a){return a},c.alphaNumerate=function(a){return String.fromCharCode(97+a%26)},c.extend=function(a){a=a||{};var b=Array.prototype.slice.call(arguments,1);return b.forEach(function(b){for(var d in b)"object"!=typeof b[d]||null===b[d]||b[d]instanceof Array?a[d]=b[d]:a[d]=c.extend({},a[d],b[d])}),a},c.replaceAll=function(a,b,c){return a.replace(new RegExp(b,"g"),c)},c.ensureUnit=function(a,b){return"number"==typeof a&&(a+=b),a},c.quantity=function(a){if("string"==typeof a){var b=/^(\d+)\s*(.*)$/g.exec(a);return{value:+b[1],unit:b[2]||void 0}}return{value:a}},c.querySelector=function(a){return a instanceof Node?a:b.querySelector(a)},c.times=function(a){return Array.apply(null,new Array(a))},c.sum=function(a,b){return a+(b?b:0)},c.mapMultiply=function(a){return function(b){return b*a}},c.mapAdd=function(a){return function(b){return b+a}},c.serialMap=function(a,b){var d=[],e=Math.max.apply(null,a.map(function(a){return a.length}));return c.times(e).forEach(function(c,e){var f=a.map(function(a){return a[e]});d[e]=b.apply(null,f)}),d},c.roundWithPrecision=function(a,b){var d=Math.pow(10,b||c.precision);return Math.round(a*d)/d},c.precision=8,c.escapingMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"},c.serialize=function(a){return null===a||void 0===a?a:("number"==typeof a?a=""+a:"object"==typeof a&&(a=JSON.stringify({data:a})),Object.keys(c.escapingMap).reduce(function(a,b){return c.replaceAll(a,b,c.escapingMap[b])},a))},c.deserialize=function(a){if("string"!=typeof a)return a;a=Object.keys(c.escapingMap).reduce(function(a,b){return c.replaceAll(a,c.escapingMap[b],b)},a);try{a=JSON.parse(a),a=void 0!==a.data?a.data:a}catch(b){}return a},c.createSvg=function(a,b,d,e){var f;return b=b||"100%",d=d||"100%",Array.prototype.slice.call(a.querySelectorAll("svg")).filter(function(a){return a.getAttributeNS("http://www.w3.org/2000/xmlns/",c.xmlNs.prefix)}).forEach(function(b){a.removeChild(b)}),f=new c.Svg("svg").attr({width:b,height:d}).addClass(e).attr({style:"width: "+b+"; height: "+d+";"}),a.appendChild(f._node),f},c.reverseData=function(a){a.labels.reverse(),a.series.reverse();for(var b=0;b<a.series.length;b++)"object"==typeof a.series[b]&&void 0!==a.series[b].data?a.series[b].data.reverse():a.series[b]instanceof Array&&a.series[b].reverse()},c.getDataArray=function(a,b,d){function e(a){if(!c.isFalseyButZero(a)){if((a.data||a)instanceof Array)return(a.data||a).map(e);if(a.hasOwnProperty("value"))return e(a.value);if(d){var b={};return"string"==typeof d?b[d]=c.getNumberOrUndefined(a):b.y=c.getNumberOrUndefined(a),b.x=a.hasOwnProperty("x")?c.getNumberOrUndefined(a.x):b.x,b.y=a.hasOwnProperty("y")?c.getNumberOrUndefined(a.y):b.y,b}return c.getNumberOrUndefined(a)}}return(b&&!a.reversed||!b&&a.reversed)&&(c.reverseData(a),a.reversed=!a.reversed),a.series.map(e)},c.normalizePadding=function(a,b){return b=b||0,"number"==typeof a?{top:a,right:a,bottom:a,left:a}:{top:"number"==typeof a.top?a.top:b,right:"number"==typeof a.right?a.right:b,bottom:"number"==typeof a.bottom?a.bottom:b,left:"number"==typeof a.left?a.left:b}},c.getMetaData=function(a,b){var d=a.data?a.data[b]:a[b];return d?c.serialize(d.meta):void 0},c.orderOfMagnitude=function(a){return Math.floor(Math.log(Math.abs(a))/Math.LN10)},c.projectLength=function(a,b,c){return b/c.range*a},c.getAvailableHeight=function(a,b){return Math.max((c.quantity(b.height).value||a.height())-(b.chartPadding.top+b.chartPadding.bottom)-b.axisX.offset,0)},c.getHighLow=function(a,b,d){function e(a){if(void 0!==a)if(a instanceof Array)for(var b=0;b<a.length;b++)e(a[b]);else{var c=d?+a[d]:+a;g&&c>f.high&&(f.high=c),h&&c<f.low&&(f.low=c)}}b=c.extend({},b,d?b["axis"+d.toUpperCase()]:{});var f={high:void 0===b.high?-Number.MAX_VALUE:+b.high,low:void 0===b.low?Number.MAX_VALUE:+b.low},g=void 0===b.high,h=void 0===b.low;return(g||h)&&e(a),(b.referenceValue||0===b.referenceValue)&&(f.high=Math.max(b.referenceValue,f.high),f.low=Math.min(b.referenceValue,f.low)),f.high<=f.low&&(0===f.low?f.high=1:f.low<0?f.high=0:f.low=0),f},c.isNum=function(a){return!isNaN(a)&&isFinite(a)},c.isFalseyButZero=function(a){return!a&&0!==a},c.getNumberOrUndefined=function(a){return isNaN(+a)?void 0:+a},c.getMultiValue=function(a,b){return c.isNum(a)?+a:a?a[b||"y"]||0:0},c.rho=function(a){function b(a,c){return a%c===0?c:b(c,a%c)}function c(a){return a*a+1}if(1===a)return a;var d,e=2,f=2;if(a%2===0)return 2;do e=c(e)%a,f=c(c(f))%a,d=b(Math.abs(e-f),a);while(1===d);return d},c.getBounds=function(a,b,d,e){var f,g,h,i=0,j={high:b.high,low:b.low};j.valueRange=j.high-j.low,j.oom=c.orderOfMagnitude(j.valueRange),j.step=Math.pow(10,j.oom),j.min=Math.floor(j.low/j.step)*j.step,j.max=Math.ceil(j.high/j.step)*j.step,j.range=j.max-j.min,j.numberOfSteps=Math.round(j.range/j.step);var k=c.projectLength(a,j.step,j),l=d>k,m=e?c.rho(j.range):0;if(e&&c.projectLength(a,1,j)>=d)j.step=1;else if(e&&m<j.step&&c.projectLength(a,m,j)>=d)j.step=m;else for(;;){if(l&&c.projectLength(a,j.step,j)<=d)j.step*=2;else{if(l||!(c.projectLength(a,j.step/2,j)>=d))break;if(j.step/=2,e&&j.step%1!==0){j.step*=2;break}}if(i++>1e3)throw new Error("Exceeded maximum number of iterations while optimizing scale step!")}for(g=j.min,h=j.max;g+j.step<=j.low;)g+=j.step;for(;h-j.step>=j.high;)h-=j.step;for(j.min=g,j.max=h,j.range=j.max-j.min,j.values=[],f=j.min;f<=j.max;f+=j.step)j.values.push(c.roundWithPrecision(f));return j},c.polarToCartesian=function(a,b,c,d){var e=(d-90)*Math.PI/180;return{x:a+c*Math.cos(e),y:b+c*Math.sin(e)}},c.createChartRect=function(a,b,d){var e=!(!b.axisX&&!b.axisY),f=e?b.axisY.offset:0,g=e?b.axisX.offset:0,h=a.width()||c.quantity(b.width).value||0,i=a.height()||c.quantity(b.height).value||0,j=c.normalizePadding(b.chartPadding,d);h=Math.max(h,f+j.left+j.right),i=Math.max(i,g+j.top+j.bottom);var k={padding:j,width:function(){return this.x2-this.x1},height:function(){return this.y1-this.y2}};return e?("start"===b.axisX.position?(k.y2=j.top+g,k.y1=Math.max(i-j.bottom,k.y2+1)):(k.y2=j.top,k.y1=Math.max(i-j.bottom-g,k.y2+1)),"start"===b.axisY.position?(k.x1=j.left+f,k.x2=Math.max(h-j.right,k.x1+1)):(k.x1=j.left,k.x2=Math.max(h-j.right-f,k.x1+1))):(k.x1=j.left,k.x2=Math.max(h-j.right,k.x1+1),k.y2=j.top,k.y1=Math.max(i-j.bottom,k.y2+1)),k},c.createGrid=function(a,b,d,e,f,g,h,i){var j={};j[d.units.pos+"1"]=a,j[d.units.pos+"2"]=a,j[d.counterUnits.pos+"1"]=e,j[d.counterUnits.pos+"2"]=e+f;var k=g.elem("line",j,h.join(" "));i.emit("draw",c.extend({type:"grid",axis:d,index:b,group:g,element:k},j))},c.createLabel=function(a,b,d,e,f,g,h,i,j,k,l){var m,n={};if(n[f.units.pos]=a+h[f.units.pos],n[f.counterUnits.pos]=h[f.counterUnits.pos],n[f.units.len]=b,n[f.counterUnits.len]=g-10,k){var o='<span class="'+j.join(" ")+'" style="'+f.units.len+": "+Math.round(n[f.units.len])+"px; "+f.counterUnits.len+": "+Math.round(n[f.counterUnits.len])+'px">'+e[d]+"</span>";m=i.foreignObject(o,c.extend({style:"overflow: visible;"},n))}else m=i.elem("text",n,j.join(" ")).text(e[d]);l.emit("draw",c.extend({type:"label",axis:f,index:d,group:i,element:m,text:e[d]},n))},c.getSeriesOption=function(a,b,c){if(a.name&&b.series&&b.series[a.name]){var d=b.series[a.name];return d.hasOwnProperty(c)?d[c]:b[c]}return b[c]},c.optionsProvider=function(b,d,e){function f(b){var f=h;if(h=c.extend({},j),d)for(i=0;i<d.length;i++){var g=a.matchMedia(d[i][0]);g.matches&&(h=c.extend(h,d[i][1]))}e&&!b&&e.emit("optionsChanged",{previousOptions:f,currentOptions:h})}function g(){k.forEach(function(a){a.removeListener(f)})}var h,i,j=c.extend({},b),k=[];if(!a.matchMedia)throw"window.matchMedia not found! Make sure you're using a polyfill.";if(d)for(i=0;i<d.length;i++){var l=a.matchMedia(d[i][0]);l.addListener(f),k.push(l)}return f(!0),{removeMediaQueryListeners:g,getCurrentOptions:function(){return c.extend({},h)}}}}(window,document,a),function(a,b,c){"use strict";c.Interpolation={},c.Interpolation.none=function(a){var b={fillHoles:!1};return a=c.extend({},b,a),function(b,d){for(var e=new c.Svg.Path,f=!0,g=0;g<b.length;g+=2){var h=b[g],i=b[g+1],j=d[g/2];void 0!==j.value?(f?e.move(h,i,!1,j):e.line(h,i,!1,j),f=!1):a.fillHoles||(f=!0)}return e}},c.Interpolation.simple=function(a){var b={divisor:2,fillHoles:!1};a=c.extend({},b,a);var d=1/Math.max(1,a.divisor);return function(b,e){for(var f,g,h,i=new c.Svg.Path,j=0;j<b.length;j+=2){var k=b[j],l=b[j+1],m=(k-f)*d,n=e[j/2];void 0!==n.value?(void 0===h?i.move(k,l,!1,n):i.curve(f+m,g,k-m,l,k,l,!1,n),f=k,g=l,h=n):a.fillHoles||(f=k=h=void 0)}return i}},c.Interpolation.cardinal=function(a){function b(b,c){for(var d=[],e=!0,f=0;f<b.length;f+=2)void 0===c[f/2].value?a.fillHoles||(e=!0):(e&&(d.push({pathCoordinates:[],valueData:[]}),e=!1),d[d.length-1].pathCoordinates.push(b[f],b[f+1]),d[d.length-1].valueData.push(c[f/2]));return d}var d={tension:1,fillHoles:!1};a=c.extend({},d,a);var e=Math.min(1,Math.max(0,a.tension)),f=1-e;return function g(a,d){var h=b(a,d);if(h.length>1){var i=[];return h.forEach(function(a){i.push(g(a.pathCoordinates,a.valueData))}),c.Svg.Path.join(i)}if(a=h[0].pathCoordinates,d=h[0].valueData,a.length<=4)return c.Interpolation.none()(a,d);for(var j,k=(new c.Svg.Path).move(a[0],a[1],!1,d[0]),l=0,m=a.length;m-2*!j>l;l+=2){var n=[{x:+a[l-2],y:+a[l-1]},{x:+a[l],y:+a[l+1]},{x:+a[l+2],y:+a[l+3]},{x:+a[l+4],y:+a[l+5]}];j?l?m-4===l?n[3]={x:+a[0],y:+a[1]}:m-2===l&&(n[2]={x:+a[0],y:+a[1]},n[3]={x:+a[2],y:+a[3]}):n[0]={x:+a[m-2],y:+a[m-1]}:m-4===l?n[3]=n[2]:l||(n[0]={x:+a[l],y:+a[l+1]}),k.curve(e*(-n[0].x+6*n[1].x+n[2].x)/6+f*n[2].x,e*(-n[0].y+6*n[1].y+n[2].y)/6+f*n[2].y,e*(n[1].x+6*n[2].x-n[3].x)/6+f*n[2].x,e*(n[1].y+6*n[2].y-n[3].y)/6+f*n[2].y,n[2].x,n[2].y,!1,d[(l+2)/2])}return k}},c.Interpolation.step=function(a){var b={postpone:!0,fillHoles:!1};return a=c.extend({},b,a),function(b,d){for(var e,f,g,h=new c.Svg.Path,i=0;i<b.length;i+=2){var j=b[i],k=b[i+1],l=d[i/2];void 0!==l.value?(void 0===g?h.move(j,k,!1,l):(a.postpone?h.line(j,f,!1,g):h.line(e,k,!1,l),h.line(j,k,!1,l)),e=j,f=k,g=l):a.fillHoles||(e=f=g=void 0)}return h}}}(window,document,a),function(a,b,c){"use strict";c.EventEmitter=function(){function a(a,b){d[a]=d[a]||[],d[a].push(b)}function b(a,b){d[a]&&(b?(d[a].splice(d[a].indexOf(b),1),0===d[a].length&&delete d[a]):delete d[a])}function c(a,b){d[a]&&d[a].forEach(function(a){a(b)}),d["*"]&&d["*"].forEach(function(c){c(a,b)})}var d=[];return{addEventHandler:a,removeEventHandler:b,emit:c}}}(window,document,a),function(a,b,c){"use strict";function d(a){var b=[];if(a.length)for(var c=0;c<a.length;c++)b.push(a[c]);return b}function e(a,b){var d=b||this.prototype||c.Class,e=Object.create(d);c.Class.cloneDefinitions(e,a);var f=function(){var a,b=e.constructor||function(){};return a=this===c?Object.create(e):this,b.apply(a,Array.prototype.slice.call(arguments,0)),a};return f.prototype=e,f["super"]=d,f.extend=this.extend,f}function f(){var a=d(arguments),b=a[0];return a.splice(1,a.length-1).forEach(function(a){Object.getOwnPropertyNames(a).forEach(function(c){delete b[c],Object.defineProperty(b,c,Object.getOwnPropertyDescriptor(a,c))})}),b}c.Class={extend:e,cloneDefinitions:f}}(window,document,a),function(a,b,c){"use strict";function d(a,b,d){return a&&(this.data=a,this.eventEmitter.emit("data",{type:"update",data:this.data})),b&&(this.options=c.extend({},d?this.options:this.defaultOptions,b),this.initializeTimeoutId||(this.optionsProvider.removeMediaQueryListeners(),this.optionsProvider=c.optionsProvider(this.options,this.responsiveOptions,this.eventEmitter))),this.initializeTimeoutId||this.createChart(this.optionsProvider.getCurrentOptions()),this}function e(){return this.initializeTimeoutId?a.clearTimeout(this.initializeTimeoutId):(a.removeEventListener("resize",this.resizeListener),this.optionsProvider.removeMediaQueryListeners()),this}function f(a,b){return this.eventEmitter.addEventHandler(a,b),this}function g(a,b){return this.eventEmitter.removeEventHandler(a,b),this}function h(){a.addEventListener("resize",this.resizeListener),this.optionsProvider=c.optionsProvider(this.options,this.responsiveOptions,this.eventEmitter),this.eventEmitter.addEventHandler("optionsChanged",function(){this.update()}.bind(this)),this.options.plugins&&this.options.plugins.forEach(function(a){a instanceof Array?a[0](this,a[1]):a(this)}.bind(this)),this.eventEmitter.emit("data",{type:"initial",data:this.data}),this.createChart(this.optionsProvider.getCurrentOptions()),this.initializeTimeoutId=void 0}function i(a,b,d,e,f){this.container=c.querySelector(a),this.data=b,this.defaultOptions=d,this.options=e,this.responsiveOptions=f,this.eventEmitter=c.EventEmitter(),this.supportsForeignObject=c.Svg.isSupported("Extensibility"),this.supportsAnimations=c.Svg.isSupported("AnimationEventsAttribute"),this.resizeListener=function(){this.update()}.bind(this),this.container&&(this.container.__chartist__&&this.container.__chartist__.detach(),this.container.__chartist__=this),this.initializeTimeoutId=setTimeout(h.bind(this),0)}c.Base=c.Class.extend({constructor:i,optionsProvider:void 0,container:void 0,svg:void 0,eventEmitter:void 0,createChart:function(){throw new Error("Base chart type can't be instantiated!")},update:d,detach:e,on:f,off:g,version:c.version,supportsForeignObject:!1})}(window,document,a),function(a,b,c){"use strict";function d(a,d,e,f,g){a instanceof Element?this._node=a:(this._node=b.createElementNS(z,a),"svg"===a&&this._node.setAttributeNS(A,c.xmlNs.qualifiedName,c.xmlNs.uri)),d&&this.attr(d),e&&this.addClass(e),f&&(g&&f._node.firstChild?f._node.insertBefore(this._node,f._node.firstChild):f._node.appendChild(this._node))}function e(a,b){return"string"==typeof a?b?this._node.getAttributeNS(b,a):this._node.getAttribute(a):(Object.keys(a).forEach(function(d){void 0!==a[d]&&(b?this._node.setAttributeNS(b,[c.xmlNs.prefix,":",d].join(""),a[d]):this._node.setAttribute(d,a[d]))}.bind(this)),this)}function f(a,b,d,e){return new c.Svg(a,b,d,this,e)}function g(){return this._node.parentNode instanceof SVGElement?new c.Svg(this._node.parentNode):null}function h(){for(var a=this._node;"svg"!==a.nodeName;)a=a.parentNode;return new c.Svg(a)}function i(a){var b=this._node.querySelector(a);return b?new c.Svg(b):null}function j(a){var b=this._node.querySelectorAll(a);return b.length?new c.Svg.List(b):null}function k(a,c,d,e){if("string"==typeof a){var f=b.createElement("div");f.innerHTML=a,a=f.firstChild}a.setAttribute("xmlns",B);var g=this.elem("foreignObject",c,d,e);return g._node.appendChild(a),g}function l(a){return this._node.appendChild(b.createTextNode(a)),this}function m(){for(;this._node.firstChild;)this._node.removeChild(this._node.firstChild);return this}function n(){return this._node.parentNode.removeChild(this._node),this.parent()}function o(a){return this._node.parentNode.replaceChild(a._node,this._node),a}function p(a,b){return b&&this._node.firstChild?this._node.insertBefore(a._node,this._node.firstChild):this._node.appendChild(a._node),this}function q(){return this._node.getAttribute("class")?this._node.getAttribute("class").trim().split(/\s+/):[]}function r(a){return this._node.setAttribute("class",this.classes(this._node).concat(a.trim().split(/\s+/)).filter(function(a,b,c){return c.indexOf(a)===b}).join(" ")),this}function s(a){var b=a.trim().split(/\s+/);return this._node.setAttribute("class",this.classes(this._node).filter(function(a){return-1===b.indexOf(a)}).join(" ")),this}function t(){return this._node.setAttribute("class",""),this}function u(a,b){try{return a.getBBox()[b]}catch(c){}return 0}function v(){return this._node.clientHeight||Math.round(u(this._node,"height"))||this._node.parentNode.clientHeight}function w(){return this._node.clientWidth||Math.round(u(this._node,"width"))||this._node.parentNode.clientWidth}function x(a,b,d){return void 0===b&&(b=!0),Object.keys(a).forEach(function(e){function f(a,b){var f,g,h,i={};a.easing&&(h=a.easing instanceof Array?a.easing:c.Svg.Easing[a.easing],delete a.easing),a.begin=c.ensureUnit(a.begin,"ms"),a.dur=c.ensureUnit(a.dur,"ms"),h&&(a.calcMode="spline",a.keySplines=h.join(" "),a.keyTimes="0;1"),b&&(a.fill="freeze",i[e]=a.from,this.attr(i),g=c.quantity(a.begin||0).value,a.begin="indefinite"),f=this.elem("animate",c.extend({attributeName:e},a)),b&&setTimeout(function(){try{f._node.beginElement()}catch(b){i[e]=a.to,this.attr(i),f.remove()}}.bind(this),g),d&&f._node.addEventListener("beginEvent",function(){d.emit("animationBegin",{element:this,animate:f._node,params:a})}.bind(this)),f._node.addEventListener("endEvent",function(){d&&d.emit("animationEnd",{element:this,animate:f._node,params:a}),b&&(i[e]=a.to,this.attr(i),f.remove())}.bind(this))}a[e]instanceof Array?a[e].forEach(function(a){f.bind(this)(a,!1)}.bind(this)):f.bind(this)(a[e],b)}.bind(this)),this}function y(a){var b=this;this.svgElements=[];for(var d=0;d<a.length;d++)this.svgElements.push(new c.Svg(a[d]));Object.keys(c.Svg.prototype).filter(function(a){return-1===["constructor","parent","querySelector","querySelectorAll","replace","append","classes","height","width"].indexOf(a)}).forEach(function(a){b[a]=function(){var d=Array.prototype.slice.call(arguments,0);return b.svgElements.forEach(function(b){c.Svg.prototype[a].apply(b,d)}),b}})}var z="http://www.w3.org/2000/svg",A="http://www.w3.org/2000/xmlns/",B="http://www.w3.org/1999/xhtml";c.xmlNs={qualifiedName:"xmlns:ct",prefix:"ct",uri:"http://gionkunz.github.com/chartist-js/ct"},c.Svg=c.Class.extend({constructor:d,attr:e,elem:f,parent:g,root:h,querySelector:i,querySelectorAll:j,foreignObject:k,text:l,empty:m,remove:n,replace:o,append:p,classes:q,addClass:r,removeClass:s,removeAllClasses:t,height:v,width:w,animate:x}),c.Svg.isSupported=function(a){return b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#"+a,"1.1")};var C={easeInSine:[.47,0,.745,.715],easeOutSine:[.39,.575,.565,1],easeInOutSine:[.445,.05,.55,.95],easeInQuad:[.55,.085,.68,.53],easeOutQuad:[.25,.46,.45,.94],easeInOutQuad:[.455,.03,.515,.955],easeInCubic:[.55,.055,.675,.19],easeOutCubic:[.215,.61,.355,1],easeInOutCubic:[.645,.045,.355,1],easeInQuart:[.895,.03,.685,.22],easeOutQuart:[.165,.84,.44,1],easeInOutQuart:[.77,0,.175,1],easeInQuint:[.755,.05,.855,.06],easeOutQuint:[.23,1,.32,1],easeInOutQuint:[.86,0,.07,1],easeInExpo:[.95,.05,.795,.035],easeOutExpo:[.19,1,.22,1],easeInOutExpo:[1,0,0,1],easeInCirc:[.6,.04,.98,.335],easeOutCirc:[.075,.82,.165,1],easeInOutCirc:[.785,.135,.15,.86],easeInBack:[.6,-.28,.735,.045],easeOutBack:[.175,.885,.32,1.275],easeInOutBack:[.68,-.55,.265,1.55]};c.Svg.Easing=C,c.Svg.List=c.Class.extend({constructor:y})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e,f,g){var h=c.extend({command:f?a.toLowerCase():a.toUpperCase()},b,g?{data:g}:{});d.splice(e,0,h)}function e(a,b){a.forEach(function(c,d){u[c.command.toLowerCase()].forEach(function(e,f){b(c,e,d,f,a)})})}function f(a,b){this.pathElements=[],this.pos=0,this.close=a,this.options=c.extend({},v,b)}function g(a){return void 0!==a?(this.pos=Math.max(0,Math.min(this.pathElements.length,a)),this):this.pos}function h(a){return this.pathElements.splice(this.pos,a),this}function i(a,b,c,e){return d("M",{x:+a,y:+b},this.pathElements,this.pos++,c,e),this}function j(a,b,c,e){return d("L",{x:+a,y:+b},this.pathElements,this.pos++,c,e),this}function k(a,b,c,e,f,g,h,i){return d("C",{x1:+a,y1:+b,x2:+c,y2:+e,x:+f,y:+g},this.pathElements,this.pos++,h,i),this}function l(a,b,c,e,f,g,h,i,j){return d("A",{rx:+a,ry:+b,xAr:+c,lAf:+e,sf:+f,x:+g,y:+h},this.pathElements,this.pos++,i,j),this}function m(a){var b=a.replace(/([A-Za-z])([0-9])/g,"$1 $2").replace(/([0-9])([A-Za-z])/g,"$1 $2").split(/[\s,]+/).reduce(function(a,b){return b.match(/[A-Za-z]/)&&a.push([]),a[a.length-1].push(b),a},[]);"Z"===b[b.length-1][0].toUpperCase()&&b.pop();var d=b.map(function(a){var b=a.shift(),d=u[b.toLowerCase()];return c.extend({command:b},d.reduce(function(b,c,d){return b[c]=+a[d],b},{}))}),e=[this.pos,0];return Array.prototype.push.apply(e,d),Array.prototype.splice.apply(this.pathElements,e),this.pos+=d.length,this}function n(){var a=Math.pow(10,this.options.accuracy);return this.pathElements.reduce(function(b,c){var d=u[c.command.toLowerCase()].map(function(b){return this.options.accuracy?Math.round(c[b]*a)/a:c[b]}.bind(this));return b+c.command+d.join(",")}.bind(this),"")+(this.close?"Z":"")}function o(a,b){return e(this.pathElements,function(c,d){c[d]*="x"===d[0]?a:b}),this}function p(a,b){return e(this.pathElements,function(c,d){c[d]+="x"===d[0]?a:b}),this}function q(a){return e(this.pathElements,function(b,c,d,e,f){var g=a(b,c,d,e,f);(g||0===g)&&(b[c]=g)}),this}function r(a){var b=new c.Svg.Path(a||this.close);return b.pos=this.pos,b.pathElements=this.pathElements.slice().map(function(a){return c.extend({},a)}),b.options=c.extend({},this.options),b}function s(a){var b=[new c.Svg.Path];return this.pathElements.forEach(function(d){d.command===a.toUpperCase()&&0!==b[b.length-1].pathElements.length&&b.push(new c.Svg.Path),b[b.length-1].pathElements.push(d)}),b}function t(a,b,d){for(var e=new c.Svg.Path(b,d),f=0;f<a.length;f++)for(var g=a[f],h=0;h<g.pathElements.length;h++)e.pathElements.push(g.pathElements[h]);return e}var u={m:["x","y"],l:["x","y"],c:["x1","y1","x2","y2","x","y"],a:["rx","ry","xAr","lAf","sf","x","y"]},v={accuracy:3};c.Svg.Path=c.Class.extend({constructor:f,position:g,remove:h,move:i,line:j,curve:k,arc:l,scale:o,translate:p,transform:q,parse:m,stringify:n,clone:r,splitByCommand:s}),c.Svg.Path.elementDescriptions=u,c.Svg.Path.join=t}(window,document,a),function(a,b,c){"use strict";function d(a,b,c,d){this.units=a,this.counterUnits=a===f.x?f.y:f.x,this.chartRect=b,this.axisLength=b[a.rectEnd]-b[a.rectStart],this.gridOffset=b[a.rectOffset],this.ticks=c,this.options=d}function e(a,b,d,e,f){var g=e["axis"+this.units.pos.toUpperCase()],h=this.ticks.map(this.projectValue.bind(this)),i=this.ticks.map(g.labelInterpolationFnc);h.forEach(function(j,k){var l,m={x:0,y:0};l=h[k+1]?h[k+1]-j:Math.max(this.axisLength-j,30),(i[k]||0===i[k])&&("x"===this.units.pos?(j=this.chartRect.x1+j,m.x=e.axisX.labelOffset.x,"start"===e.axisX.position?m.y=this.chartRect.padding.top+e.axisX.labelOffset.y+(d?5:20):m.y=this.chartRect.y1+e.axisX.labelOffset.y+(d?5:20)):(j=this.chartRect.y1-j,m.y=e.axisY.labelOffset.y-(d?l:0),"start"===e.axisY.position?m.x=d?this.chartRect.padding.left+e.axisY.labelOffset.x:this.chartRect.x1-10:m.x=this.chartRect.x2+e.axisY.labelOffset.x+10),g.showGrid&&c.createGrid(j,k,this,this.gridOffset,this.chartRect[this.counterUnits.len](),a,[e.classNames.grid,e.classNames[this.units.dir]],f),g.showLabel&&c.createLabel(j,l,k,i,this,g.offset,m,b,[e.classNames.label,e.classNames[this.units.dir],e.classNames[g.position]],d,f))}.bind(this))}var f={x:{pos:"x",len:"width",dir:"horizontal",rectStart:"x1",rectEnd:"x2",rectOffset:"y2"},y:{pos:"y",len:"height",dir:"vertical",rectStart:"y2",rectEnd:"y1",rectOffset:"x1"}};c.Axis=c.Class.extend({constructor:d,createGridAndLabels:e,projectValue:function(a,b,c){throw new Error("Base axis can't be instantiated!")}}),c.Axis.units=f}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){var f=e.highLow||c.getHighLow(b.normalized,e,a.pos);this.bounds=c.getBounds(d[a.rectEnd]-d[a.rectStart],f,e.scaleMinSpace||20,e.onlyInteger),this.range={min:this.bounds.min,max:this.bounds.max},c.AutoScaleAxis["super"].constructor.call(this,a,d,this.bounds.values,e)}function e(a){return this.axisLength*(+c.getMultiValue(a,this.units.pos)-this.bounds.min)/this.bounds.range}c.AutoScaleAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){var f=e.highLow||c.getHighLow(b.normalized,e,a.pos);this.divisor=e.divisor||1,this.ticks=e.ticks||c.times(this.divisor).map(function(a,b){return f.low+(f.high-f.low)/this.divisor*b}.bind(this)),this.ticks.sort(function(a,b){return a-b}),this.range={min:f.low,max:f.high},c.FixedScaleAxis["super"].constructor.call(this,a,d,this.ticks,e),this.stepLength=this.axisLength/this.divisor}function e(a){return this.axisLength*(+c.getMultiValue(a,this.units.pos)-this.range.min)/(this.range.max-this.range.min)}c.FixedScaleAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a,b,d,e){c.StepAxis["super"].constructor.call(this,a,d,e.ticks,e),this.stepLength=this.axisLength/(e.ticks.length-(e.stretch?1:0))}function e(a,b){return this.stepLength*b}c.StepAxis=c.Axis.extend({constructor:d,projectValue:e})}(window,document,a),function(a,b,c){"use strict";function d(a){var b={raw:this.data,normalized:c.getDataArray(this.data,a.reverseData,!0)};this.svg=c.createSvg(this.container,a.width,a.height,a.classNames.chart);var d,e,g=this.svg.elem("g").addClass(a.classNames.gridGroup),h=this.svg.elem("g"),i=this.svg.elem("g").addClass(a.classNames.labelGroup),j=c.createChartRect(this.svg,a,f.padding);d=void 0===a.axisX.type?new c.StepAxis(c.Axis.units.x,b,j,c.extend({},a.axisX,{ticks:b.raw.labels,stretch:a.fullWidth})):a.axisX.type.call(c,c.Axis.units.x,b,j,a.axisX),e=void 0===a.axisY.type?new c.AutoScaleAxis(c.Axis.units.y,b,j,c.extend({},a.axisY,{high:c.isNum(a.high)?a.high:a.axisY.high,low:c.isNum(a.low)?a.low:a.axisY.low})):a.axisY.type.call(c,c.Axis.units.y,b,j,a.axisY),d.createGridAndLabels(g,i,this.supportsForeignObject,a,this.eventEmitter),e.createGridAndLabels(g,i,this.supportsForeignObject,a,this.eventEmitter),b.raw.series.forEach(function(f,g){var i=h.elem("g");i.attr({"series-name":f.name,meta:c.serialize(f.meta)},c.xmlNs.uri),i.addClass([a.classNames.series,f.className||a.classNames.series+"-"+c.alphaNumerate(g)].join(" "));var k=[],l=[];b.normalized[g].forEach(function(a,h){var i={x:j.x1+d.projectValue(a,h,b.normalized[g]),y:j.y1-e.projectValue(a,h,b.normalized[g])};k.push(i.x,i.y),l.push({value:a,valueIndex:h,meta:c.getMetaData(f,h)})}.bind(this));var m={lineSmooth:c.getSeriesOption(f,a,"lineSmooth"),showPoint:c.getSeriesOption(f,a,"showPoint"),showLine:c.getSeriesOption(f,a,"showLine"),showArea:c.getSeriesOption(f,a,"showArea"),areaBase:c.getSeriesOption(f,a,"areaBase")},n="function"==typeof m.lineSmooth?m.lineSmooth:m.lineSmooth?c.Interpolation.cardinal():c.Interpolation.none(),o=n(k,l);if(m.showPoint&&o.pathElements.forEach(function(b){var h=i.elem("line",{x1:b.x,y1:b.y,x2:b.x+.01,y2:b.y},a.classNames.point).attr({value:[b.data.value.x,b.data.value.y].filter(function(a){return a}).join(","),meta:b.data.meta},c.xmlNs.uri);this.eventEmitter.emit("draw",{type:"point",value:b.data.value,index:b.data.valueIndex,meta:b.data.meta,series:f,seriesIndex:g,axisX:d,axisY:e,group:i,element:h,x:b.x,y:b.y})}.bind(this)),m.showLine){var p=i.elem("path",{d:o.stringify()},a.classNames.line,!0);this.eventEmitter.emit("draw",{type:"line",values:b.normalized[g],path:o.clone(),chartRect:j,index:g,series:f,seriesIndex:g,axisX:d,axisY:e,group:i,element:p})}if(m.showArea&&e.range){var q=Math.max(Math.min(m.areaBase,e.range.max),e.range.min),r=j.y1-e.projectValue(q);o.splitByCommand("M").filter(function(a){return a.pathElements.length>1}).map(function(a){var b=a.pathElements[0],c=a.pathElements[a.pathElements.length-1];return a.clone(!0).position(0).remove(1).move(b.x,r).line(b.x,b.y).position(a.pathElements.length+1).line(c.x,r)}).forEach(function(h){var k=i.elem("path",{d:h.stringify()},a.classNames.area,!0).attr({values:b.normalized[g]},c.xmlNs.uri);this.eventEmitter.emit("draw",{type:"area",values:b.normalized[g],path:h.clone(),series:f,seriesIndex:g,axisX:d,axisY:e,chartRect:j,index:g,group:i,element:k})}.bind(this))}}.bind(this)),this.eventEmitter.emit("created",{bounds:e.bounds,chartRect:j,axisX:d,axisY:e,svg:this.svg,options:a})}function e(a,b,d,e){c.Line["super"].constructor.call(this,a,b,f,c.extend({},f,d),e)}var f={axisX:{offset:30,position:"end",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,type:void 0},axisY:{offset:40,position:"start",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,type:void 0,scaleMinSpace:20,onlyInteger:!1},width:void 0,height:void 0,showLine:!0,showPoint:!0,showArea:!1,areaBase:0,lineSmooth:!0,low:void 0,high:void 0,chartPadding:{top:15,right:15,bottom:5,left:10},fullWidth:!1,reverseData:!1,classNames:{chart:"ct-chart-line",label:"ct-label",labelGroup:"ct-labels",series:"ct-series",line:"ct-line",point:"ct-point",area:"ct-area",grid:"ct-grid",gridGroup:"ct-grids",vertical:"ct-vertical",horizontal:"ct-horizontal",start:"ct-start",end:"ct-end"}};c.Line=c.Base.extend({constructor:e,createChart:d})}(window,document,a),function(a,b,c){"use strict";function d(a){var b,d={raw:this.data,normalized:a.distributeSeries?c.getDataArray(this.data,a.reverseData,a.horizontalBars?"x":"y").map(function(a){return[a]}):c.getDataArray(this.data,a.reverseData,a.horizontalBars?"x":"y")};this.svg=c.createSvg(this.container,a.width,a.height,a.classNames.chart+(a.horizontalBars?" "+a.classNames.horizontalBars:""));var e=this.svg.elem("g").addClass(a.classNames.gridGroup),g=this.svg.elem("g"),h=this.svg.elem("g").addClass(a.classNames.labelGroup);if(a.stackBars){var i=c.serialMap(d.normalized,function(){return Array.prototype.slice.call(arguments).map(function(a){return a}).reduce(function(a,b){return{x:a.x+b.x||0,y:a.y+b.y||0}},{x:0,y:0})});b=c.getHighLow([i],c.extend({},a,{referenceValue:0}),a.horizontalBars?"x":"y")}else b=c.getHighLow(d.normalized,c.extend({},a,{referenceValue:0}),a.horizontalBars?"x":"y");b.high=+a.high||(0===a.high?0:b.high),b.low=+a.low||(0===a.low?0:b.low);var j,k,l,m,n,o=c.createChartRect(this.svg,a,f.padding);k=a.distributeSeries&&a.stackBars?d.raw.labels.slice(0,1):d.raw.labels,a.horizontalBars?(j=m=void 0===a.axisX.type?new c.AutoScaleAxis(c.Axis.units.x,d,o,c.extend({},a.axisX,{highLow:b,referenceValue:0})):a.axisX.type.call(c,c.Axis.units.x,d,o,c.extend({},a.axisX,{highLow:b,referenceValue:0})),l=n=void 0===a.axisY.type?new c.StepAxis(c.Axis.units.y,d,o,{ticks:k}):a.axisY.type.call(c,c.Axis.units.y,d,o,a.axisY)):(l=m=void 0===a.axisX.type?new c.StepAxis(c.Axis.units.x,d,o,{ticks:k}):a.axisX.type.call(c,c.Axis.units.x,d,o,a.axisX),j=n=void 0===a.axisY.type?new c.AutoScaleAxis(c.Axis.units.y,d,o,c.extend({},a.axisY,{highLow:b,referenceValue:0})):a.axisY.type.call(c,c.Axis.units.y,d,o,c.extend({},a.axisY,{highLow:b,referenceValue:0})));var p=a.horizontalBars?o.x1+j.projectValue(0):o.y1-j.projectValue(0),q=[];l.createGridAndLabels(e,h,this.supportsForeignObject,a,this.eventEmitter),j.createGridAndLabels(e,h,this.supportsForeignObject,a,this.eventEmitter),d.raw.series.forEach(function(b,e){var f,h,i=e-(d.raw.series.length-1)/2;f=a.distributeSeries&&!a.stackBars?l.axisLength/d.normalized.length/2:a.distributeSeries&&a.stackBars?l.axisLength/2:l.axisLength/d.normalized[e].length/2,h=g.elem("g"),h.attr({"series-name":b.name,meta:c.serialize(b.meta)},c.xmlNs.uri),h.addClass([a.classNames.series,b.className||a.classNames.series+"-"+c.alphaNumerate(e)].join(" ")),d.normalized[e].forEach(function(g,k){var r,s,t,u;if(u=a.distributeSeries&&!a.stackBars?e:a.distributeSeries&&a.stackBars?0:k,r=a.horizontalBars?{x:o.x1+j.projectValue(g&&g.x?g.x:0,k,d.normalized[e]),y:o.y1-l.projectValue(g&&g.y?g.y:0,u,d.normalized[e])}:{x:o.x1+l.projectValue(g&&g.x?g.x:0,u,d.normalized[e]),y:o.y1-j.projectValue(g&&g.y?g.y:0,k,d.normalized[e])},l instanceof c.StepAxis&&(l.options.stretch||(r[l.units.pos]+=f*(a.horizontalBars?-1:1)),r[l.units.pos]+=a.stackBars||a.distributeSeries?0:i*a.seriesBarDistance*(a.horizontalBars?-1:1)),t=q[k]||p,q[k]=t-(p-r[l.counterUnits.pos]),void 0!==g){var v={};v[l.units.pos+"1"]=r[l.units.pos],v[l.units.pos+"2"]=r[l.units.pos],!a.stackBars||"accumulate"!==a.stackMode&&a.stackMode?(v[l.counterUnits.pos+"1"]=p,v[l.counterUnits.pos+"2"]=r[l.counterUnits.pos]):(v[l.counterUnits.pos+"1"]=t,v[l.counterUnits.pos+"2"]=q[k]),v.x1=Math.min(Math.max(v.x1,o.x1),o.x2),
v.x2=Math.min(Math.max(v.x2,o.x1),o.x2),v.y1=Math.min(Math.max(v.y1,o.y2),o.y1),v.y2=Math.min(Math.max(v.y2,o.y2),o.y1),s=h.elem("line",v,a.classNames.bar).attr({value:[g.x,g.y].filter(function(a){return a}).join(","),meta:c.getMetaData(b,k)},c.xmlNs.uri),this.eventEmitter.emit("draw",c.extend({type:"bar",value:g,index:k,meta:c.getMetaData(b,k),series:b,seriesIndex:e,axisX:m,axisY:n,chartRect:o,group:h,element:s},v))}}.bind(this))}.bind(this)),this.eventEmitter.emit("created",{bounds:j.bounds,chartRect:o,axisX:m,axisY:n,svg:this.svg,options:a})}function e(a,b,d,e){c.Bar["super"].constructor.call(this,a,b,f,c.extend({},f,d),e)}var f={axisX:{offset:30,position:"end",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,scaleMinSpace:30,onlyInteger:!1},axisY:{offset:40,position:"start",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:c.noop,scaleMinSpace:20,onlyInteger:!1},width:void 0,height:void 0,high:void 0,low:void 0,onlyInteger:!1,chartPadding:{top:15,right:15,bottom:5,left:10},seriesBarDistance:15,stackBars:!1,stackMode:"accumulate",horizontalBars:!1,distributeSeries:!1,reverseData:!1,classNames:{chart:"ct-chart-bar",horizontalBars:"ct-horizontal-bars",label:"ct-label",labelGroup:"ct-labels",series:"ct-series",bar:"ct-bar",grid:"ct-grid",gridGroup:"ct-grids",vertical:"ct-vertical",horizontal:"ct-horizontal",start:"ct-start",end:"ct-end"}};c.Bar=c.Base.extend({constructor:e,createChart:d})}(window,document,a),function(a,b,c){"use strict";function d(a,b,c){var d=b.x>a.x;return d&&"explode"===c||!d&&"implode"===c?"start":d&&"implode"===c||!d&&"explode"===c?"end":"middle"}function e(a){var b,e,f,h,i,j=[],k=a.startAngle,l=c.getDataArray(this.data,a.reverseData);this.svg=c.createSvg(this.container,a.width,a.height,a.donut?a.classNames.chartDonut:a.classNames.chartPie),e=c.createChartRect(this.svg,a,g.padding),f=Math.min(e.width()/2,e.height()/2),i=a.total||l.reduce(function(a,b){return a+b},0);var m=c.quantity(a.donutWidth);"%"===m.unit&&(m.value*=f/100),f-=a.donut?m.value/2:0,h="outside"===a.labelPosition||a.donut?f:"center"===a.labelPosition?0:f/2,h+=a.labelOffset;var n={x:e.x1+e.width()/2,y:e.y2+e.height()/2},o=1===this.data.series.filter(function(a){return a.hasOwnProperty("value")?0!==a.value:0!==a}).length;a.showLabel&&(b=this.svg.elem("g",null,null,!0));for(var p=0;p<this.data.series.length;p++){var q=this.data.series[p];j[p]=this.svg.elem("g",null,null,!0),j[p].attr({"series-name":q.name},c.xmlNs.uri),j[p].addClass([a.classNames.series,q.className||a.classNames.series+"-"+c.alphaNumerate(p)].join(" "));var r=k+l[p]/i*360;r-k===360&&(r-=.01);var s=c.polarToCartesian(n.x,n.y,f,k-(0===p||o?0:.2)),t=c.polarToCartesian(n.x,n.y,f,r),u=new c.Svg.Path(!a.donut).move(t.x,t.y).arc(f,f,0,r-k>180,0,s.x,s.y);a.donut||u.line(n.x,n.y);var v=j[p].elem("path",{d:u.stringify()},a.donut?a.classNames.sliceDonut:a.classNames.slicePie);if(v.attr({value:l[p],meta:c.serialize(q.meta)},c.xmlNs.uri),a.donut&&v.attr({style:"stroke-width: "+m.value+"px"}),this.eventEmitter.emit("draw",{type:"slice",value:l[p],totalDataSum:i,index:p,meta:q.meta,series:q,group:j[p],element:v,path:u.clone(),center:n,radius:f,startAngle:k,endAngle:r}),a.showLabel){var w=c.polarToCartesian(n.x,n.y,h,k+(r-k)/2),x=a.labelInterpolationFnc(this.data.labels?this.data.labels[p]:l[p],p);if(x||0===x){var y=b.elem("text",{dx:w.x,dy:w.y,"text-anchor":d(n,w,a.labelDirection)},a.classNames.label).text(""+x);this.eventEmitter.emit("draw",{type:"label",index:p,group:b,element:y,text:""+x,x:w.x,y:w.y})}}k=r}this.eventEmitter.emit("created",{chartRect:e,svg:this.svg,options:a})}function f(a,b,d,e){c.Pie["super"].constructor.call(this,a,b,g,c.extend({},g,d),e)}var g={width:void 0,height:void 0,chartPadding:5,classNames:{chartPie:"ct-chart-pie",chartDonut:"ct-chart-donut",series:"ct-series",slicePie:"ct-slice-pie",sliceDonut:"ct-slice-donut",label:"ct-label"},startAngle:0,total:void 0,donut:!1,donutWidth:60,showLabel:!0,labelOffset:0,labelPosition:"inside",labelInterpolationFnc:c.noop,labelDirection:"neutral",reverseData:!1};c.Pie=c.Base.extend({constructor:f,createChart:e,determineAnchorPosition:d})}(window,document,a),a});
//# sourceMappingURL=chartist.min.js.map
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Chartist.plugins.ctPointLabels'] = factory();
  }
}(this, function () {

  /**
   * Chartist.js plugin to display a data label on top of the points in a line chart.
   *
   */
  /* global Chartist */
  (function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
      labelClass: 'ct-label',
      labelOffset: {
        x: 0,
        y: -10
      },
      textAnchor: 'middle',
      labelInterpolationFnc: Chartist.noop
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctPointLabels = function(options) {

      options = Chartist.extend({}, defaultOptions, options);

      return function ctPointLabels(chart) {
        if(chart instanceof Chartist.Line) {
          chart.on('draw', function(data) {
            if(data.type === 'point') {
              data.group.elem('text', {
                x: data.x + options.labelOffset.x,
                y: data.y + options.labelOffset.y,
                style: 'text-anchor: ' + options.textAnchor
              }, options.labelClass).text(options.labelInterpolationFnc(data.value.x === undefined ? data.value.y : data.value.x + ', ' + data.value.y));
            }
          });
        }
      };
    };

  }(window, document, Chartist));
  return Chartist.plugins.ctPointLabels;

}));
Polymer({
        is: "line-chart",
        properties: {
            name: String,
            unit: String,
            data: {
                type: Array,
                observer: 'dataChange'
            },
            labels: {
                type: Array,
                observer: 'labelChange'
            }
        },

        created: function () {},
        labelChange: function () {},
        dataChange: function () {
                //                setTimeout(function () {
                // console.log('line-chart', this.name, this.data, this.labels);
                var data = {
                    labels: new Array(8),
                    series: [this.data]
                };
                var high = Math.max.apply(0, this.data);
                if (high - low) high += ((high - low) * 1.2);
                else high *= 1.1;

                var low = Math.min.apply(0, this.data);
                //                high *= 120 / 100;
                var options = {
                    chartPadding: 0,
                    //                    low: 0,
                    //                    high: 1200,
                    high: high,
                    axisX: {
                        showGrid: false,
                        showLabel: false
                    },
                    axisY: {
                        showGrid: false,
                        showLabel: false
                    },
                    plugins: [Chartist.plugins.ctPointLabels({
                        textAnchor: 'middle'
                    })]
                };
                new Chartist.Line(this.$.chart, data, options);
                //                }.bind(this), 1000);
            }
            // fullWidth: true,
            // showArea: true,
            // low: 200,
            // high:500,
            //                low: low - 0,
    });
DATA = {
    load: function(lat, lon, callback, name) {
        STORE.getChange(lat + ',' + lon + ' days', callback, name);
    },

    update: function(lat, lon, callback) {
        console.log('update', lat, lon);
        GEO.ajax('https://api.max.pub/weather/?range=days&lat=' + lat + '&lon=' + lon, function(days) {
            days = JSON.parse(days);
            if (!days) return;
            STORE.set(lat + ',' + lon + ' days', days);
            if (callback) callback(days);
        }.bind(this));
    },

    convertDaysToSections: function(DAYS) {
        var SECTIONS = {
            temperature: [],
            precipitation: [],
            wind: [],
            light: [],
            cloudCover: [],
            moon: [],
            pressure: [],
            humidity: [],
            ozone: [],
            days: []
        };
        for (day in DAYS) {
            var d = DAYS[day];
            SECTIONS.days.push(d.day);
            SECTIONS.temperature.push(d.temperature);
            SECTIONS.light.push(d.light);
            SECTIONS.precipitation.push(d.precipitation);
            SECTIONS.wind.push(d.wind);
            SECTIONS.moon.push(d.moon);
            SECTIONS.cloudCover.push(d.cloudCover);

            // SECTIONS.humidity.push(d.humidity);
            SECTIONS.humidity.push(Math.round(d.humidity * 100));
            SECTIONS.ozone.push(Math.round(d.ozone));
            SECTIONS.pressure.push(Math.round(d.pressure));
        }
        return SECTIONS;
    }
};
Polymer({
        is: "week-weather",
        properties: {
            lat:{
                type: Number,
                observer: 'change'
            },
            lon:{
                type: Number,
                observer: 'change'
            },
        },
        ready: function(){
            this.onlineStatus();
            window.addEventListener('online',  this.onlineStatus.bind(this));
            window.addEventListener('offline', this.onlineStatus.bind(this));
        },
        onlineStatus: function(){
            // console.log('online',navigator.onLine);
            this.set('offline',navigator.onLine?false:true);
        },
        change: function(){
            this.set('sections',null);
            if(!this.lat) return;
            if(!this.lon) return;

            this.debounce('search', function(){
                DATA.load(this.lat, this.lon, function(days){
                    console.log('data',days);
                    this.set('loading',days?false:true);
                    if(!days) return;
                    this.set('sections', DATA.convertDaysToSections(days));
                }.bind(this));
                DATA.update(this.lat, this.lon);
            }.bind(this), 100);
        }

    });
Polymer({
        is: "week-days",
        properties: {
            lat:{
                type: Number,
                observer: 'change'
            },
            lon:{
                type: Number,
                observer: 'change'
            },
        },

        change: function () {
            if(!this.lat) return;
            if(!this.lon) return;
            this.debounce('search', function(){
                DATA.load(this.lat, this.lon, function(days){
                    this.set('labels', DATA.convertDaysToSections(days).days);
                }.bind(this),'labels');
            }.bind(this), 100);
        },
        caps: function(str){
            return str;
            return str.toUpperCase();
        }

    });
Polymer({
        is: "one-city",
        properties: {
            data: {
                type:Object,
                observer: 'change'
            },
            type: String
        },
        ready:function(){
            if(!this.star) this.star = false;
        },
        change: function () {
            if(!this.data.lat) return;
            this.string = this.data.lat.toFixed(2) + ',' + this.data.lon.toFixed(2) + ' city';
            STORE.getChange(this.string, function(val){
                this.set('star',val?true:false);
                // console.log('city-change',this.data.city,this.star,val,this);
            }.bind(this), this.type);
        },
        setCity: function(event){
            this.fire('select',this.data);
        },
        round: function(val){
        	return val;
            return Math.round(val);
        },
        addStar: function(){
            STORE.set(this.string, this.data);
        },
        delStar: function(){
            STORE.del(this.string);
        }
    });
Polymer({
        is: "find-cities",
        search: function(event){
            // var query = event.target.value;
            var query = this.$.search.value;
            if(event==='+city') query += ' city';
            console.log('place-search',query);
            GEO.search(query, function(places){
                console.log('place-search',places);
                if((!places.length)&&(event!='+city')) return this.search('+city');
                this.set('searchResults',places);
            }.bind(this), {type:'city'});
        },
        searchDelayed: function(event){
            this.debounce('search', this.search.bind(this) ,500);
        }
    });
Polymer({
        is: "nearby-cities",

        ready: function () {
            GEO.gps(function(pos){
                GEO.search(pos.lat+','+pos.lon, function(places){
                    this.set('gps',places[0]);
                }.bind(this),{type:'city'});
            }.bind(this));
            
            GEO.ip(function(pos){
                GEO.search(pos.lat+','+pos.lon, function(places){
                    this.set('ip',places[0]);
                }.bind(this),{type:'city'});
            }.bind(this));
        }
    });
Polymer({
        is: "recent-cities",

        ready: function () {
            this.loadFavorites();
            STORE.onChange('.* city',function(key,val){
                console.log("STORE-change",key,val);
                this.loadFavorites();
            }.bind(this));
        },

        loadFavorites: function(){
            STORE.getAll(function(list){
                var favorites = [];
                for(var i in list)
                    if(i.indexOf('city')!==-1)
                        favorites.push(list[i]);
                favorites.sort(this.citySort);
                this.set('favorites',favorites);
            }.bind(this));
        },
        citySort: function(a,b){ // asc
            if(a.city<b.city) return -1;
            if(a.city>b.city) return 1;
            return 0;
        }

    });
MegaCities = [{
		"city": "Shanghai",
		"country": "China",
		"population": 36,
		"lat": 31.23,
		"lon": 121.47
	}, {
		"city": "New York",
		"country": "United States",
		"population": 24,
		"lat": 40.71,
		"lon": -74.01
	}, {
		"city": "Bangkok",
		"country": "Thailand",
		"population": 15,
		"lat": 13.76,
		"lon": 100.50
	}, {
	// 	"city": "Tokyo",
	// 	"country": "Japan",
	// 	"population": 39,
	// 	"lat": 35.68,
	// 	"lon": 139.68
	// }, {
	// 	"city": "Jakarta",
	// 	"country": "Indonesia",
	// 	"population": 32,
	// 	"lat": -6.17,
	// 	"lon": 106.82
	// }, {
		"city": "Seoul",
		"country": "South Korea",
		"population": 26,
		"lat": 37.57,
		"lon": 126.98
	}, {
		"city": "Delhi",
		"country": "India",
		"population": 22,
		"lat": 28.61,
		"lon": 77.21
	}, {
		"city": "Sao Paulo",
		"country": "Brazil",
		"population": 22,
		"lat": -23.55,
		"lon": -46.63
	}, {
		"city": "Lagos",
		"country": "Nigeria",
		"population": 21,
		"lat": 6.52,
		"lon": 3.38
	}, {
		"city": "London",
		"country": "England",
		"population": 14,
		"lat": 51.51,
		"lon": -0.13
	}, {
		"city": "Paris",
		"country": "France",
		"population": 12,
		"lat": 48.86,
		"lon": 2.35
	}, {
		"city": "Moscow",
		"country": "Russia",
		"population": 17,
		"lat": 55.76,
		"lon": 37.62
	}, {
		"city": "Cairo",
		"country": "Egypt",
		"population": 19,
		"lat": 30.04,
		"lon": 31.24
	}, {
		"city": "Mexico City",
		"country": "Mexico",
		"population": 22,
		"lat": 19.43,
		"lon": -99.13
	}, {
		"city": "Kyoto",
		"country": "Japan",
		"population": 20,
		"lat": 35.01,
		"lon": 135.77
	}, {
		"city": "Hong Kong",
		"country": "China",
		"population": 20,
		"lat": 22.28,
		"lon": 114.17
	}, {
		"city": "Kinshasa",
		"country": "Congo",
		"population": 12,
		"lat": -4.44,
		"lon": 15.27
	}, {
		"city": "Manila",
		"country": "Philippines",
		"population": 12,
		"lat": 14.60,
		"lon": 120.98
	}, {
		"city": "Tehran",
		"country": "Iran",
		"population": 14,
		"lat": 35.69,
		"lon": 51.39
	}, {
		"city": "Buenos Aires",
		"country": "Argentina",
		"population": 14,
		"lat": -34.60,
		"lon": -58.38
	}, {
		"city": "Rio de Janeiro",
		"country": "Brazil",
		"population": 14,
		"lat": -22.91,
		"lon": -43.17
	}, {
		"city": "Istanbul",
		"country": "Turkey",
		"population": 15,
		"lat": 41.01,
		"lon": 28.98
	}, {
		"city": "Dhaka",
		"country": "Bangladesh",
		"population": 18,
		"lat": 23.81,
		"lon": 90.41
	}, {
		"city": "Los Angeles",
		"country": "United States",
		"population": 19,
		"lat": 34.05,
		"lon": -118.24
	}, {
		"city": "Bejing",
		"country": "China",
		"population": 25,
		"lat": 39.90,
		"lon": 116.41
	}, {
		"city": "Karachi",
		"country": "Pakistan",
		"population": 24,
		"lat": 24.86,
		"lon": 67.01
	}




];
Polymer({
        is: "mega-cities",

        ready: function () {
            MegaCities.sort(this.populationSort);
            this.set('defaults',MegaCities);
        },
        
        citySort: function(a,b){ // asc
            if(a.city<b.city) return -1;
            if(a.city>b.city) return 1;
            return 0;
        },
        populationSort: function(a,b){ // desc
            if(a.population<b.population) return 1;
            if(a.population>b.population) return -1;
            return 0;
        }

    });
Polymer({
        is: "city-picker",
    });
Polymer({
        is: "app-title",
    });
STORE = {
    available: {},
    use: 'fallback',

    init: function() {
        try {
            localStorage;
            STORE.use = 'html5';
        } catch (e) {}
        try {
            chrome.storage.local;
            STORE.use = 'chrome';
        } catch (e) {}
        console.log('STORE uses', STORE.use);

        STORE.set = STORE[STORE.use].set;
        STORE.get = STORE[STORE.use].get;
        STORE.del = STORE[STORE.use].del;
        STORE.getAll = STORE[STORE.use].getAll;
        STORE.list = STORE[STORE.use].list;
    },


    log: function(p) {
        console.log('STORE.js log:', p)
    },



    changeListeners: {},
    onChange: function(regex, callback, name) {
        // STORE.changeListeners[regex] = callback;
        if (!name) name = 'default';
        if (!STORE.changeListeners[regex])
            STORE.changeListeners[regex] = {};
        STORE.changeListeners[regex][name] = callback;
        console.log(Object.keys(STORE.changeListeners[regex]), 'event handlers on', regex);
    },
    clearChangeListener: function(regex, name) {
        if (regex)
            if (name) delete STORE.changeListeners[regex][name];
            else STORE.changeListeners[regex] = {};
        else STORE.changeListeners = {};
    },
    informChange: function(key, val) {
        for (var regex in STORE.changeListeners)
            if (key.match(new RegExp('^' + regex + '$')))
                for (var i in STORE.changeListeners[regex])
                    STORE.changeListeners[regex][i](key, val);
            // STORE.changeListeners[regex](key, val);
            // console.log('inform', key, regex, key.match(new RegExp('^' + regex + '$')));
    },
    getChange: function(key, callback, name) {
        STORE.onChange(key, function(key, val) {
            callback(val);
        }, name);
        STORE.get(key, callback);
    },



    html5: {
        set: function(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
            STORE.informChange(key, val);
            // STORE.changeListeners[key](val);
            // STORE.changeListeners['*'](val);
        },
        get: function(key, callback) {
            callback(JSON.parse(localStorage.getItem(key)));
        },
        getAll: function(callback) {
            var list = {};
            for (var key in localStorage)
                try {
                    list[key] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    list[key] = localStorage.getItem(key);
                }
            callback(list);
        },
        del: function(key) {
            localStorage.removeItem(key);
            STORE.informChange(key, null);
        },
        list: function(callback) {
            callback(Object.keys(localStorage));
        }
    },

    chrome: {
        set: function(key, val) {
            var set = {};
            set[key] = val;
            chrome.storage.local.set(set);
            STORE.informChange(key, val);
        },
        get: function(key, callback) {
            chrome.storage.local.get(key, function(res) {
                callback(res[key]);
            });
        },
        getAll: function(callback) {
            chrome.storage.local.get(callback);
        },
        del: function(key) {
            chrome.storage.local.remove(key);
            STORE.informChange(key, null);
        },
        list: function(callback) {
            chrome.storage.local.get(function(res) {
                callback(Object.keys(res));
            });
        }
    },

    win8: {

    },

    fallback: {

    }
};

STORE.init();



// set: function(key, val) {
//     STORE[STORE.use].set(key, val);
// },
// get: function(key, callback) {
//     STORE[STORE.use].get(key, function(res) {
//         if (callback) callback(res);
//         else console.log('STORE-GET', key, ':', res);
//     });
// },
// del: function(key) {
//     STORE[STORE.use].del(key);
// },
// getAll: function(callback) {
//     STORE[STORE.use].getAll(function(res) {
//         if (callback) callback(res);
//         else console.log('STORE-GETALL', res);
//     });
// },
// list: function(callback) {
//     STORE[STORE.use].list(function(res) {
//         if (callback) callback(res);
//         else console.log('STORE-LIST', res);
//     });
// },
GEO = {
    provider: {
        search: {
            demo: { // replace demo.search by function for syntax-cosistency with GeoIP
                search: function(query, callback) {
                    GEO.log('search.DEMO', query);
                    GEO.ajax("demo.search.json", function(raw) {
                        var places = JSON.parse(raw);
                        GEO.log('search', places);
                        if (callback) callback(places);
                    });
                }
            }
        },
        ip: {
            default: 'max_pub',
            ipinfo_io: function(callback) {
                GEO.ajax('http://ipinfo.io/json/', function(data) {
                    data = JSON.parse(data);
                    var latlon = data.loc.split(',');
                    GEO.location.ip = {
                        ip: data.ip,
                        country: data.country,
                        region: data.region,
                        city: data.city,
                        lat: (latlon[0] * 1).toFixed(2),
                        lon: (latlon[1] * 1).toFixed(2),
                        provider: 'ipinfo.io'
                    };
                    if (callback) callback(GEO.location.ip);
                });
            },
            max_pub: function(callback) {
                GEO.ajax('https://api.max.pub/geoip/', function(data) {
                    data = JSON.parse(data);
                    GEO.location.ip = data;
                    if (callback) callback(GEO.location.ip);
                });
            }
        }
    },



    location: {
        ip: {},
        gps: {}
    },



    ajax: function(url, callback) { // simple AJAX implementation
        var req = new XMLHttpRequest();
        if (!req) return;
        req.open('GET', url, true);
        req.onreadystatechange = function() {
            if (req.readyState == 4)
                if (callback) callback(req.responseText);
        };
        req.onerror = function() {}; /// replace by ADD-EVENT-HANDLER
        req.send();
    },


    log: function(p, q) {
        if (q) console.log('GEO.js:', p, q);
        else console.log('GEO.js:', p);
    },

    ip: function(callback) {
        GEO.provider.ip[GEO.provider.ip.default](callback);
    },

    gps: function(callback) {
        console.time('GEO.gps');
        // .watchPosition     .getCurrentPosition
        navigator.geolocation.watchPosition(function(pos) { // success
            console.timeEnd('GEO.gps');
            if (pos.coords.latitude.toFixed(5) != GEO.location.gps.lat) var latDiff = true;
            if (pos.coords.longitude.toFixed(5) != GEO.location.gps.lon) var lonDiff = true;

            GEO.location.gps.lat = pos.coords.latitude.toFixed(5) * 1;
            GEO.location.gps.lon = pos.coords.longitude.toFixed(5) * 1;
            GEO.location.gps.accuracy = pos.coords.accuracy;
            GEO.location.gps.raw = pos;
            if (latDiff || lonDiff) {
                GEO.log('gps', GEO.location.gps);
                if (callback) callback(GEO.location.gps);
            }
        }, function(error) { // error
            console.error('geo.gps.error', error)
        });
    },


    locate: function(callback) {
        GEO.ip(function(data) {
            if (GEO.location.gps.lat) return;
            if (callback) callback(data, 'ip');
        });

        GEO.gps(callback, 'gps');
    },

    locateAndName: function(callback, filter) { // remove this -> build into locate(location, name);
        GEO.locate(function(data) {
            GEO.search(data.lat + ',' + data.lon, function(list) {
                // GEO.log('locateAndName', list[0]);
                if (callback) callback(list[0]);
            }, filter);
        });
    },



    filter: function(loc, filter) { // filter results e.g. {type:'city'} to see just cities...
        var ret = [];
        for (var i = 0; i < loc.length; i++) {
            var use = true;
            for (var f in filter)
                if (loc[i][f] != filter[f]) use = false;
            if (use) ret.push(loc[i]);
        }
        return ret;
    },
    searchAndFilter: function(provider, query, callback, filter) {
        GEO.provider.search[provider].search(query, function(list) {
            if (filter) list = GEO.filter(list, filter);
            if (callback) callback(list);
        });
    },

    search: function(query, callback, filter) {
        if (GEO.provider.search.google)
            GEO.searchAndFilter('google', query, callback, filter);
        else
            GEO.searchAndFilter('demo', query, callback, filter);
    },
};
// console.log("LOADING GOOGLE", GEO);

if (!GEO) GEO = {};


GEO.provider.search.google = { // using google maps api... implementing bing,OSM,nokia with same interface later
    types: {
        country: 'country',
        administrative_area_level_1: 'state',
        administrative_area_level_2: 'county',
        locality: 'city',
        sublocality: 'quarter',
        neighborhood: 'neighborhood',
        route: 'street',
        street_number: 'streetNumber',
        postal_code: 'zipCode',
        street_address: 'street',
        postal_town: 'city'
    },

    parse: function(data) {
        var list = [];
        var types = GEO.provider.search.google.types;
        for (var i in data.results) {
            var dat = data.results[i];
            var location = {};
            var address = dat.address_components;
            for (var part in address) {
                var typ = address[part].types[0];
                //            console.log('part',address[part]);
                if (types[typ]) location[types[typ]] = address[part].long_name;
                if (types[typ]) location[types[typ] + 'Code'] = address[part].short_name;
                if (location[types[typ]] == location[types[typ] + 'Code']) delete location[types[typ] + 'Code'];
            }
            location.string = dat.formatted_address;
            location.lat = dat.geometry.location.lat.toFixed(5) * 1;
            location.lon = dat.geometry.location.lng.toFixed(5) * 1;
            location.type = types[dat.types[0]];
            //        console.log("TYP:",dat.types[0],' -> ',location.type);
            list.push(location);
        }
        return list;
    },
    search: function(query, callback) { // call with "lat,lng,callback"   OR    "address,callback"
        GEO.ajax("https://maps.google.com/maps/api/geocode/json?sensor=true&address=" + query, function(result) { // &language=de
            var raw = JSON.parse(result);
            var places = GEO.provider.search.google.parse(raw);
            if (callback) callback(places, raw);
        });
    }
};

// console.log("LOADING GOOGLE", GEO.provider.search);
Polymer({
        is: "app-root",
        setHash: function(ev){
            var city = ev.detail;
            setLocation(city.lat, city.lon);
            // document.location.hash = '#'+ city.lat.toFixed(2)+'#'+city.lon.toFixed(2);
        }
    });

    setLocation = function(lat,lon){
        document.location.hash = ''+ (lat*1).toFixed(2)+','+(lon*1).toFixed(2);
    };