( function( window, document, undefined ) {
	var Controller = function( parameters ) {
		var self = this,
			model = parameters.model,
			view = parameters.view,
			sample_file = parameters.sample_file,
			hundred = 100,
			seconds_in_minute = 60,
			default_time_string = '-:--';
			
		var buttonClickHandler = function( data ) {
			switch ( data.name ) {
			case 'sample':
				if ( sample_file !== undefined ) {
					model.useRemoteFile( sample_file );
				} else {
					console.warn( 'Sample file is not specified' );
				}
				
				break;
				
			case 'play':
				model.play();
				break;
				
			case 'stop':
				model.stop();
				break;
			}
		};
		
		var switcherClickHandler = function( data ) {
			switch ( data.name ) {
			case 'equalizer-prev':
				model.switchEqualizer( 'prev' );
				break;
				
			case 'equalizer-next':
				model.switchEqualizer( 'next' );
				break;
				
			case 'display-prev':
				model.switchDisplay( 'prev' );
				break;
				
			case 'display-next':
				model.switchDisplay( 'next' );
				break;
			}
		};
		
		var loadStateHandler = function( data ) {
			switch ( data.state ) {
			case 'start':
				view.disableControl( 'upload', true );
				view.disableControl( 'sample', true );
				view.disableControl( 'stop', true );
				view.disableControl( 'play', true );
				view.disableControl( 'equalizer', true );
				view.disableControl( 'display', true );
				view.wait( true );
				break;
				
			case 'finish':
				view.disableControl( 'upload', false );
				view.disableControl( 'sample', false );
				view.wait( false );
			
				if ( data.is_successful === true ) {
					model.play();
				} else {
					console.warn( 'couldn`t load "%s" file', data.filename );
				}
				break;
			}
		};
		
		var secondsToString = function( seconds ) {
			var minutes = Math.floor( seconds / seconds_in_minute ),
				seconds = seconds - minutes * seconds_in_minute;
			
			if ( seconds < 10 ) {
				seconds = '0' + seconds;
			}
			
			return minutes + ':' + seconds;
		};
		
		var refreshIndicatorsHandler = function( data ) {
			var passed_time = data.passed_time,
				duration = data.duration,
				percent = Math.round( hundred * passed_time / duration );
			
			view.setTrackData( data.track_data );
			
			view.setTime( {
				passed_time: secondsToString( passed_time ),
				duration: secondsToString( duration ),
				percent: percent
			} );
			
			view.setVisualization( {
				data: data.analysed_data,
				length: data.analysed_length
			} );
			
			view.setTrackFilename( data.filename );
		};
		
		var playStateChangeHandler = function( data ) {
			view.disableControl( 'upload', false );
			view.disableControl( 'sample', false );
			view.disableControl( 'stop', true );
			view.disableControl( 'play', true );
		
			switch ( data.state ) {
			case 'play':
				view.disableControl( 'stop', false );
				view.hideControl( 'stop', false );
				view.hideControl( 'play', true );
				view.disableControl( 'equalizer', false );
				view.disableControl( 'display', false );
				break;
				
			case 'stop':
				view.disableControl( 'play', false );
				view.hideControl( 'play', false );
				view.hideControl( 'stop', true );
				view.disableControl( 'equalizer', true );
				view.disableControl( 'display', true );
				break;
			}
		};
		
		var equalizerChangeHandler = function( data ) {
			view.setSwitcherValue( 'equalizer', data.name );
		};
		
		var displayChangeHandler = function( data ) {
			view.setSwitcherValue( 'display', data.name );
		};
		
		var fileTransferHandler = function( data ) {
			model.useLocalFile( data.file );
		};
		
		self.init = function() {
			model.init();
			view.init();
			
			view.disableControl( 'upload', false );
			view.disableControl( 'sample', false );
			view.disableControl( 'stop', true );
			view.disableControl( 'play', true );
			view.disableControl( 'equalizer', true );
			view.disableControl( 'display', true );
			view.hideControl( 'stop', true );
			
			view.setTime( {
				passed_time: default_time_string,
				duration: default_time_string,
				percent: 0
			} );
			
			view.setVisualization( {
				data: [ 0 ],
				length: 1
			} );
			
			view.on( 'Button clicked', buttonClickHandler );
			view.on( 'Switcher clicked', switcherClickHandler );
			view.on( 'File transfered', fileTransferHandler );
			model.on( 'Play state changed', playStateChangeHandler );
			model.on( 'Load state changed', loadStateHandler );
			model.on( 'Indicators refreshed', refreshIndicatorsHandler );
			model.on( 'Equalizer changed', equalizerChangeHandler );
			model.on( 'Display changed', displayChangeHandler );
			
			model.switchEqualizer();
			model.switchDisplay();
		};
	};
	
	window.Controller = window.Controller || Controller;
} )( window, document );