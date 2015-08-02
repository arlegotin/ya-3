( function( window, document, Equalizer, undefined ) {
	var AudioPlayer = function( parameters ) {
		var self = this,
			context,
			source,
			analyser,
			analyser_data_length,
			analyser_data_array,
			current_buffer,
			destination,
			onReady = parameters.onReady,
			onError = parameters.onError,
			is_playing = false,
			play_time = 0,
			analyzer_fourier = parameters.analyzer_fourier || 32,
			current_track_data,
			equalizer_db_range = parameters.equalizer_db_range,
			equalizer_frequencies = parameters.equalizer_frequencies,
			equalizer,
			current_filename;
			
		var createContext = function() {
			try {
				context = new ( window.AudioContext || window.webkitAudioContext );
			} catch ( error ) {
				context = false;
			}
		};
		
		var createPeakingFilter = function( frequency ) {
			var filter = context.createBiquadFilter();
			
			filter.type = 'peaking';
			filter.frequency.value = frequency;
			filter.Q.value = 1;
			filter.gain.value = 0;
			
			return filter;
		};
		
		self.decodeData = function( data, callback ) {
			context.decodeAudioData( data, function( decoded_data ) {
				callback && callback( decoded_data );
			}, function( error ) {
				callback && callback( false );
			} );
		};
		
		self.setBuffer = function( buffer ) {
			current_buffer = buffer;
		};
		
		self.setFilter = function() {
		};
		
		self.setData = function( data ) {
			current_track_data = data;
		};
		
		self.tuneEqualizer = function( values ) {
			equalizer.tune( values );
		};
		
		self.getData = function() {
			return current_track_data || {};
		};
		
		self.setFilename = function( value ) {
			current_filename = value;
		};
		
		self.getFilename = function() {
			return current_filename || '';
		};
		
		self.connect = function() {
			source.connect( equalizer.input );
			equalizer.output.connect( analyser );
			analyser.connect( destination );
		};
		
		self.getCurrentTime = function() {
			return context !== undefined ? context.currentTime : 0;
		};
		
		self.getPlayedTime = function() {
			return is_playing === true ? self.getCurrentTime() - play_time : 0;
		};
		
		self.getDuration = function() {
			return current_buffer !== undefined ? current_buffer.duration : 0;
		};
		
		self.play = function( callback, onPlayEnd ) {
			if ( is_playing === false ) {
				source = context.createBufferSource();
				source.buffer = current_buffer;
				
				source.onended = function() {
					onPlayEnd && onPlayEnd();
				};
				
				self.connect();
				
				source.start( 0 );
				
				play_time = self.getCurrentTime();
				
				is_playing = true;
				
				callback && callback();
			}
		};
		
		self.stop = function( callback ) {
			if ( is_playing === true ) {
				source.stop( 0 );
			
				is_playing = false;
				
				callback && callback();
			}
		};
		
		self.analyse = function() {
			if ( is_playing === true ) {
				analyser.getByteFrequencyData( analyser_data_array );
				
				return analyser_data_array;
			} else {
				return [ 0 ];
			}
		};
		
		self.getAnaliserLength = function() {
			return is_playing === true ? analyser_data_length : 1;
		};
			
		self.init = function() {
			createContext();
			
			if ( context !== false ) {
				destination = context.destination;
				
				analyser = context.createAnalyser();
				analyser.fftSize = analyzer_fourier;
				analyser_data_length = analyser.frequencyBinCount;
				analyser_data_array = new Uint8Array( analyser_data_length );
				
				equalizer = new Equalizer( {
					range: equalizer_db_range,
					frequencies: equalizer_frequencies,
					filterGenerator: createPeakingFilter
				} );
				
				onReady && onReady( self );
			} else {
				onError && onError( 'Browser doesn`t support WebAudio API' );
			}
		};
	};
	
	window.AudioPlayer = window.AudioPlayer || AudioPlayer;
} )( window, document, window.Equalizer );