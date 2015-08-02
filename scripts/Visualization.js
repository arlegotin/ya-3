( function( window, document ) {
	var Visualization = function( options ) {
		var that = this,
			parent = options.element,
			canvas = document.createElement( 'canvas' ),
			context = canvas.getContext( '2d' ),
			width = parent.offsetWidth,
			height = parent.offsetHeight,
			color = options.color,
			byte_size = 255;
		
		canvas.width = width;
		canvas.height = height;
			
		parent.appendChild( canvas );
		
		that.draw = function( data, length ) {
			var bar_gap = 12,
				bar_width = ( width - ( length - 1 ) * bar_gap ) / length,
				i,
				bar_height,
				x;
				
			context.clearRect( 0, 0, width, height );	
			context.beginPath();
			context.fillStyle = color;
				
			for ( i = 0; i < length; i++ ) {
				bar_height = height * data[ i ] / byte_size;
				x = i * ( bar_width + bar_gap );
				
				context.fillRect( x, height - bar_height, bar_width, bar_height );
			}
		};
	};
	
	window.Visualization = window.Visualization || Visualization;
} )( window, document );