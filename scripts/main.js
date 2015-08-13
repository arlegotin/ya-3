( function( window, document, $, Model, View, Controller, undefined ) {
    var main = function() {
        var controller = new Controller( {
            model: new Model( {
                analyzer_fourier: 64,
                equalizer_db_range: 12,
                equalizer_frequencies: [ 50, 90, 160, 300, 500, 900, 1600, 3000, 5000, 9000, 16000 ],
                equalizer_settings: {
                    'normal': [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    'jazz': [ -1, -0.75, -0.25, 0.25, 0.75, 1, 0.75, 0.25, -0.25, -0.75, -1 ],
                    'rock': [ 0, -0.5, 0, 0.5, 1, -0.5, -1, 0.5, 0, -0.5, 0 ],
                    'hip-hop': [ 1, 0.75, 0.25, -0.25, -0.75, 1, 1, -0.25, 0.25, 0.75, 1 ],
                    'reggae': [ -1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1 ],
                    'classic': [ 1, 0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4, -0.6, -0.8, -1 ],
                    'blues': [ 1, 1, -1, 1, 0, -1, 0, 1, -1, 0, 1 ],
                    'disco': [ 0, 1, -1, 0, 0, 1, 0, 0, -1, 1, 0 ]
                },
                refresh_time: 50
            } ),
            view: new View( {
                selector: '.player',
                visualization_color: '#DF2935'
            } ),
            sample_file: 'audio/sample.mp3'
        } );
        
        controller.init();
    };
    
    $( main );
} )( window, document, window.jQuery, window.Model, window.View, window.Controller );