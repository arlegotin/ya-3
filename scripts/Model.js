( function( window, document, EventManager, AudioPlayer, LoopedList, id3, undefined ) {
	var Model = function( parameters ) {
		var self = this,
			audio = new AudioPlayer( {
				analyzer_fourier: parameters.analyzer_fourier,
				equalizer_db_range: parameters.equalizer_db_range,
				equalizer_frequencies: parameters.equalizer_frequencies
			} ),
			refresh_time = parameters.refresh_time || 100,
			refresh_interval,
			equalizer_settings = parameters.equalizer_settings,
			equalizer_presets,
			display_presets,
			current_display;
		
		EventManager.call( self );
		
		self.getMetadata = function( file, callback ) {
			if ( id3 !== undefined ) {
				id3( file, function( error, data ){
					callback && callback( data );
				} );
			} else {
				callback && callback( {} );
			}
		};
		
		var normalizeMetadata = function( data ) {
			data.album = ( data.album || '' ).replace( /[^a-zа-я0-9.]/ig, '' );
			data.year = ( data.year || '' ).replace( /[^0-9.]/ig, '' );
			
			return data;
		};
		
		var uploadFile = function( helper, file_or_file_name ) {
			var filename;
		
			self.trigger( 'Load state changed', {
				state: 'start'
			} );
			
			if ( typeof file_or_file_name === 'object' ) {
				filename = file_or_file_name.name;
			} else {
				filename = file_or_file_name;
			}
			
			audio.setFilename( filename );
			
			helper.onload = function( event ) {
				var response = event.target.result || this.response;
				
				audio.decodeData( response, function( decoded_data ) {
					var is_success = decoded_data !== false;
					
					if ( is_success === true ) {
						audio.setBuffer( decoded_data );
						
						self.getMetadata( file_or_file_name, function( metadata ) {
							audio.setData( normalizeMetadata( metadata ) );
							
							self.trigger( 'Load state changed', {
								state: 'finish',
								is_successful: is_success
							} );
						} );
					}
				} );
			};
		};
		
		self.useLocalFile = function( file ) {
			var reader = new FileReader();
			
			uploadFile( reader, file );
		
			reader.readAsArrayBuffer( file );
		};
		
		self.useRemoteFile = function( file_name ) {
			var xhr = new XMLHttpRequest();
			
			xhr.open( 'GET', file_name, true );
			xhr.responseType = 'arraybuffer';
			
			uploadFile( xhr, file_name );
			
			xhr.send();
		};
		
		self.switchEqualizer = function( direction ) {
			var preset;
		
			switch ( direction ) {
			case 'next':
				direction = 1;
				break;
			
			case 'prev':
				direction = -1;
				break;
			
			default:
				direction = 0;
			}
			
			equalizer_presets.move( direction );
			
			preset = equalizer_presets.get();
			
			audio.tuneEqualizer( preset.values );
			
			self.trigger( 'Equalizer changed', {
				name: preset.name
			} );
		};
		
		self.switchDisplay = function( direction ) {
			switch ( direction ) {
			case 'next':
				direction = 1;
				break;
			
			case 'prev':
				direction = -1;
				break;
			
			default:
				direction = 0;
			}
			
			display_presets.move( direction );
			
			current_display = display_presets.get();
			
			self.trigger( 'Display changed', {
				name: current_display.name
			} );
		};
		
		var processMetadata = function( data ) {
			var value = '';
			
			value += data.title || 'Unknown track';
			value += ' – ';
			value += data.artist || 'Unknown artist';
			value += data.album ? ( ', ' + data.album ) : '';
			value += data.year ? ( ' (' + data.year + ')' ) : '';
			
			return value;
		};
		
		var getTrackData = function() {
			var value;
		
			switch ( current_display.name ) {
			case 'filename':
				value = audio.getFilename();
				break;
				
			case 'metadata':
				value = processMetadata( audio.getData() );
				break;
			}
			
			return value;
		};
		
		var refreshPlayerIndicators = function() {
			self.trigger( 'Indicators refreshed', {
				duration: Math.round( audio.getDuration() ),
				passed_time: Math.round( audio.getPlayedTime() ),
				analysed_data: audio.analyse(),
				analysed_length: audio.getAnaliserLength(),
				track_data: getTrackData()
			} );
		};
		
		var playHandler = function() {
			self.trigger( 'Play state changed', {
				state: 'play'
			} );
		};
		
		var stopHandler = function() {
			self.trigger( 'Play state changed', {
				state: 'stop'
			} );
		};
		
		var pauseHandler = function() {
			self.trigger( 'Play state changed', {
				state: 'pause'
			} );
		};
		
		var playStateChangeHandler = function( data ) {
			refreshPlayerIndicators();
		
			if ( data.state === 'play' ) {
				refresh_interval = setInterval( refreshPlayerIndicators, refresh_time );
			} else {
				clearInterval( refresh_interval );
			}
		};
		
		var loadStateChangeHandler = function( data ) {
			self.stop();
		};
		
		self.play = function() {
			audio.play( playHandler, self.stop );
		};
		
		self.stop = function() {
			audio.stop( stopHandler );
		};
		
		self.pause = function() {
			audio.pause( pauseHandler );
		};
		
		self.init = function() {
			audio.init();
			
			equalizer_presets = new LoopedList( {
				items: equalizer_settings
			} );
			
			display_presets = new LoopedList( {
				items: {
					'metadata': 'metadata',
					'filename': 'filename'
				}
			} );
			
			self.on( 'Play state changed', playStateChangeHandler );
			self.on( 'Load state changed', loadStateChangeHandler );
		};
	};
	
	window.Model = window.Model || Model;
} )( window, document, window.EventManager, window.AudioPlayer, window.LoopedList, window.id3 );