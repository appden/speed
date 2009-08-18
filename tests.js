
Speed({
	
	require: 'http://ajax.googleapis.com/ajax/libs/mootools/1.2.3/mootools-yui-compressed.js',
	
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
			var el = this.div.firstChild;
			do {
				if (el.tagName.toLowerCase() == 'div')
					children.push(el);
			} while (el = el.nextSibling);
		}
		
	},
	
	'getElementById in IE': {
		
		iterations: 10000,
		
		setup: function(){
			this.div = new Element('div', {
				html: '<input name="test" /><div id="TEST"></div><div id="test"></div>'
			}).inject(document.body);
			
			var get = document._getFromAll = document.getElementById;
			if (!this.activeXObject) return;
			
			document.getElementById = function(id){
				var el = get.call(document, id);
				if (!el) return null;

				if (el.attributes.id.value == id) return el;

				var all = document.all[id];
				for (var i = 1, l = all.length; i < l; i++){
					el = all[i];
					if (el.attributes.id.value == id) return el;
				}
				return null;
			};
			
			document._getFromAll = function(){
				var all = document.all[id];
				if (all) for (var i = 1, l = all.length; i < l; i++){
					var el = all[i];
					if (el.attributes.id.value == id) return el;
				}
				return null;
			}
		},
		
		teardown: function(){
			document._getFromAll = null;
			this.div.dispose();
		},
		
		'native method first': function(){
			document.getElementById('test');
			document.getElementById('TEST');
		},
		
		'only document.all': function(){
			document._getFromAll('test');
			document._getFromAll('TEST');
		}
		
	}
	
});
