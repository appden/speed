
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
		
	}
	
});
