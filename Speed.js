
(function(){
	
	var required = {};
	var loading = [];
	var callbacks = [];
	var ready = true;
	
	var require = function(files, callback){
		if (!files) return;
		if (typeof files == 'string') files = [files];
		
		var src;
		while (src = files.shift()){
			if (required[src]) continue;
			required[src] = true;
			loading.push(src);
		}
		
		if (ready) next();
		push(callback);
	};
	
	var next = function(){
		ready = !loading.length;
		if (ready){
			var callback;
			while (callback = callbacks.shift()) callback();
		} else {
			load(loading.shift(), next);
		}
	};
	
	var push = function(callback){
		if (!callback) return;
		if (ready) callback();
		else callbacks.push(callback);
	};
	
	var load = function(src, callback){
		var script = document.createElement('script');
		script.type = 'text/javascript';

		if (script.readyState) script.onreadystatechange = function(){
			if (script.readyState == 'loaded' || script.readyState == 'complete'){
				script.onreadystatechange = null;
				if (callback) callback();
			}
		};
		else script.onload = callback;

		script.src = src;
		head.appendChild(script);
	};
	
	var head = document.getElementsByTagName('head')[0];
	var activity = document.getElementById('activity');
	var playground = document.getElementById('playground');
	var console = this.console;
	
	if (!console || !console.time || !console.group || this.consoleCJSObject)
		require('http://getfirebug.com/releases/lite/1.2/firebug-lite.js', function(){
			firebug.init();
			console = firebug.d.console.cmd;
			console.group = console.info;
			console.groupEnd = function(){};
		});
		
	var active = function(on){
		activity.style.display = on ? 'block' : 'none';
	};
	active(false);
	
	var run = function(name, test, iterations){
		console.group(name);
		
		iterations = test.iterations || iterations;
		var setup = test.setup, teardown = test.teardown, before = test.before, after = test.after;
		delete test.iterations; delete test.setup; delete test.teardown; delete test.before; delete test.after;
		
		var box = playground;	// reduce lookup time
		var exec = function(fn){
			if (fn) fn.call(test, box);
		};
		
		exec(setup);
		
		for (var type in test){
			var fn = test[type];
			if (typeof fn != 'function' || type.charAt(0) == '_') continue;
			
			exec(before);
			console.time(type);
			
			for (var i = iterations; i--; ) fn.call(test, box);
			
			console.timeEnd(type);
			exec(after);
		}
		
		exec(teardown);
		box.innerHTML = '';
		console.groupEnd(name);
	};
	
	this.Speed = function(tests){
		active(true);
		require(tests.require);
		push(tests.setup);
		var iterations = tests.iterations || 100;
		
		delete tests.require; delete tests.setup; delete tests.iterations;
		
		push(function(){
			for (var name in tests) run(name, tests[name], iterations);
			active(false);
		});
	};
	
	Speed.require = require;
	
})();