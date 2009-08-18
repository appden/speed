
Speed({
	
	require: 'http://ajax.googleapis.com/ajax/libs/mootools/1.2.3/mootools.js',
	
	'Child Selector': {
		
		setup: function(){
			var append = function(div, depth){
				if (!depth) return;
				for (var i = 10; i--; )
					append(new Element('div').inject(div), depth - 1);
			};
			append(this.div = new Element('div'), 2);
		},
		
		'getElementsByTagName': function(){
			var els = this.div.getElementsByTagName('div');
			var children = [];
			for (var i = els.length; i--; ){
				if (els[i].parentNode === this.div) children.push(els[i]);
			}
		},
		
		'firstChild': function(){
			var children = [];
			var child = this.div.firstChild;
			do {
				if (child.tagName.toLowerCase() == 'div')
					children.push(child);
			} while (child = child.nextSibling);
		}
		
	},
	
	'getElementById in IE': {
		
		iterations: 1000,
		
		setup: function(){
			this.div = new Element('div', {
				html: Array(100).join('<div></div>') + '<input name="test" /><div id="TEST"></div><div id="test"></div>'
			}).inject(document.body);
			
			document._getFromId = document._getFromAll = document.getElementById;
			if (!window.ActiveXObject) return;
			
			document._getFromId = function(id){
				var el = document.getElementById(id);
				if (!el) return null;

				if (el.attributes.id.value == id) return el;

				var all = document.all[id];
				for (var i = 1, l = all.length; i < l; i++){
					var el = all[i];
					if (el.attributes.id.value == id) return el;
				}
				return null;
			};
			
			document._getFromAll = function(id){
				var all = document.all[id];
				if (all){
					if (!all.item) all = [all];
					for (var i = 0, l = all.length; i < l; i++){
						var el = all[i];
						if (el.attributes.id.value == id) return el;
					}
				}
				return null;
			};
		},
		
		teardown: function(){
			document._getFromId = document._getFromAll = null;
			this.div.dispose();
		},
		
		before: function(){
			this.failed = false;
		},
		
		after: function(){
			if (this.failed) console.warn('FAILED');
		},
		
		'native method first': function(){
			if (document._getFromId('test').id != 'test') this.failed = true;
			//if (document._getFromId('TEST').id != 'TEST') this.failed = true;
		},
		
		'only document.all': function(){
			if (document._getFromAll('test').id != 'test') this.failed = true;
			//if (document._getFromAll('TEST').id != 'TEST') this.failed = true;
		}
		
	}
	
});
