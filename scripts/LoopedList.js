( function( window, document ) {
	var LoopedList = function( parameters ) {
		var that = this,
			presets = [],
			presets_length = 0,
			current_index = 0,
			items = parameters.items;
			
		var normalizeIndex = function( index ) {
			return ( ( index % presets_length + presets_length ) % presets_length ) || 0;
		};
			
		that.add = function( name, values ) {
			presets[ presets_length++ ] = {
				name: name,
				values: values
			};
		};
		
		that.addItems = function( items ) {
			var name;
			
			for ( name in items ) {
				that.add( name, items[ name ] );
			}
		};
		
		that.get = function() {
			return presets[ current_index ];
		};
		
		that.set = function( index ) {
			current_index = normalizeIndex( index || 0 );
		};
		
		that.move = function( direction ) {
			that.set( current_index + direction );
		};
		
		if ( items !== undefined ) {
			that.addItems( items );
		}
	};
	
	window.LoopedList = window.LoopedList || LoopedList;
} )( window, document );