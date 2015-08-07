( function( window, document ) {
	var LoopedList = function( parameters ) {
		this.items = [];
		this.items_length = 0;
		this.current_index = 0;
		
		if ( parameters.items !== undefined ) {
			this.addItems( parameters.items );
		}
	};
	
	LoopedList.prototype.normalizeIndex = function( index ) {
		return ( ( index % this.items_length + this.items_length ) % this.items_length ) || 0;
	};
	
	LoopedList.prototype.add = function( name, values ) {
		this.items[ this.items_length++ ] = {
			name: name,
			values: values
		};
	};
	
	LoopedList.prototype.addItems = function( items ) {
		var name;
		
		for ( name in items ) {
			this.add( name, items[ name ] );
		}
	};
	
	LoopedList.prototype.get = function() {
		return this.items[ this.current_index ];
	};
	
	LoopedList.prototype.set = function( index ) {
		this.current_index = this.normalizeIndex( index || 0 );
	};
	
	LoopedList.prototype.move = function( direction ) {
		this.set( this.current_index + direction );
	};
	
	window.LoopedList = window.LoopedList || LoopedList;
} )( window, document );