( function( window, document, EventManager, Visualization, $, undefined ) {
    var View = function( parameters ) {
        var self = this,
            selector = parameters.selector,
            $dom = {},
            control_name_attr = 'data-control-name',
            control_type_attr = 'data-control-type',
            control_disable_class = 'control--disabled',
            control_active_class = 'control--active',
            control_hidden_class = 'control--hidden',
            visualization,
            visualization_color = parameters.visualization_color;
            
        EventManager.call( self );
            
        self.affectControl = function( affect_type, name, state ) {
            var $elements = $dom.controls,
                used_class;
                
            switch ( affect_type ) {
            case 'disable':
                used_class = control_disable_class;
                break;
            case 'activate':
                used_class = control_active_class;
                break;
            case 'hide':
                used_class = control_hidden_class;
                break;
            default:
                used_class = '';
            }
            
            if ( name !== undefined ) {
                $elements = $elements.filter( '[' + control_name_attr + '="' + name + '"]' );
            }
        
            state = state === undefined ? true : state;
            
            $elements.toggleClass( used_class, state );
        };
            
        self.disableControl = function( name, state ) {
            self.affectControl( 'disable', name, state );
        };
        
        self.activateControl = function( name, state ) {
            self.affectControl( 'activate', name, state );
        };
        
        self.hideControl = function( name, state ) {
            self.affectControl( 'hide', name, state );
        };
        
        self.setTime = function( data ) {
            $dom.indicator_passed_time.text( data.passed_time );
            $dom.indicator_duration.text( data.duration );
            $dom.indicator_line_bar_runner.css( 'width', data.percent + '%' );
        };
        
        self.setVisualization = function( data ) {
            visualization.draw( data.data, data.length );
        };
        
        self.setTrackData = function( value ) {
            $dom.display_track_data.text( value );
        };
        
        self.setTrackFilename = function( value ) {
            $dom.display_track_filename.text( value );
        };
        
        self.setSwitcherValue = function( name, value ) {
            $dom.switchers.filter( '[' + control_name_attr + '="' + name + '"]' ).find( '.control--switcher__value' ).text( value );
        };
        
        self.wait = function( state ) {
            $dom.wait.toggleClass( 'player__wait--shown', state !== false );
        };
        
        self.showDropZone = function( state ) {
            $dom.dropzone.toggleClass( 'player__dropzone--shown', state !== false );
        };
        
        self.setDisplayMode = function( mode ) {
            $dom.display_track_filename.addClass( 'display__item--hidden' );
            $dom.display_track_data.addClass( 'display__item--hidden' );
        
            switch ( mode ) {
            case 'filename':
                $dom.display_track_filename.removeClass( 'display__item--hidden' );
                break;
                
            case 'metadata':
                $dom.display_track_data.removeClass( 'display__item--hidden' );
                break;
            }
            
            self.setSwitcherValue( 'display', mode );
        };
        
        var buttonClickHandler = function() {
            self.trigger( 'Button clicked', {
                name: $( this ).attr( control_name_attr ),
                element: this
            } );
        };
        
        var switcherClickHandler = function() {
            self.trigger( 'Switcher clicked', {
                name: $( this ).attr( 'data-switcher' ),
                element: this
            } );
        };
        
        var fileTransferHandler = function( event ) {
            self.trigger( 'File transfered', {
                file: this.files[ 0 ]
            } );
            
            this.value = '';
        };
        
        var cancelEvent = function( event ) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        
        var bindFileDrop = function() {
            document.body.ondragover = cancelEvent;
            
            document.body.ondrop = function( event ) {
                if ( event.dataTransfer && event.dataTransfer.files ) {
                    self.trigger( 'File transfered', {
                        file: event.dataTransfer.files[ 0 ]
                    } );
                }
                
                cancelEvent( event );
                return false;
            };
        };
            
        var assign = function() {
            $dom.player = $( selector );
            $dom.wait = $dom.player.find( '.player__wait' );
            $dom.dropzone = $dom.player.find( '.player__dropzone' );
            $dom.controls = $dom.player.find( '[' + control_name_attr + ']' );
            $dom.buttons = $dom.controls.filter( '[' + control_type_attr + '="button"]' );
            $dom.switchers = $dom.controls.filter( '[' + control_type_attr + '="switcher"]' );
            $dom.control_upload = $dom.controls.filter( '[' + control_name_attr + '="upload"]' );
            $dom.control_upload_input = $dom.control_upload.find( 'input' );
            $dom.display = $dom.player.find( '.display' );
            $dom.display_visualization = $dom.display.find( '.display__item--visualization' );
            $dom.display_track_data = $dom.display.find( '.display__item--track_data' );
            $dom.display_track_filename = $dom.display.find( '.display__item--track_filename' );
            $dom.display_indicators = $dom.display.find( '.indicator' );
            $dom.indicator_passed_time = $dom.display_indicators.filter( '.indicator--passed_time' );
            $dom.indicator_duration = $dom.display_indicators.filter( '.indicator--duration' );
            $dom.indicator_line_bar_runner = $dom.display_indicators.filter( '.indicator--line__bar__runner' );
            
            visualization = new Visualization( {
                element: $dom.display_visualization.get( 0 ),
                color: visualization_color
            } );
        };
        
        var bind = function() {
            $dom.buttons.on( 'click', buttonClickHandler );
            $dom.control_upload_input.on( 'change', fileTransferHandler );
            $dom.switchers.find( '[data-switcher]' ).on( 'click', switcherClickHandler );
            
            bindFileDrop();
        };
        
        self.init = function() {
            assign();
            bind();
        };
    };
    
    window.View = window.View || View;
} )( window, document, window.EventManager, window.Visualization, window.jQuery );