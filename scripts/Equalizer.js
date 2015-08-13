( function( window, document ) {
    var Equalizer = function( parameters ) {
        var that = this,
            frequencies = parameters.frequencies,
            filterGenerator = parameters.filterGenerator,
            length = frequencies.length,
            filters = frequencies.map( filterGenerator ),
            range = parameters.range;
            
        filters.reduce( function( input, output ) {
            input.connect( output );
            
            return output;
        } );
        
        that.tuneByIndex = function( value, i ) {
            filters[ i ].gain.value = value * range;
        };
        
        that.tune = function( values ) {
            values.forEach( that.tuneByIndex );
        };
        
        that.input = filters[ 0 ];
        that.output = filters[ length - 1 ];
    };
    
    window.Equalizer = window.Equalizer || Equalizer;
} )( window, document );