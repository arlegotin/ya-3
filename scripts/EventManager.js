( function( window, document, undefined ) {
    var EventManager = function( default_namespace ) {
        var that = this,
            events = [],
            events_length = 0;
            
        this.on = function( name, namespace, callback ) {
            if ( callback === undefined ) {
                callback = namespace;
                namespace = undefined;
            }
            
            events[ events_length++ ] = {
                name: name,
                namespace: default_namespace || namespace,
                callback: callback
            };
        };
        
        this.off = function( name, namespace ) {
            var event,
                remove_it,
                remove_indexes = [],
                i;
                
            name = name || undefined;
            namespace = default_namespace || namespace || undefined;
                
            for ( i = 0; i < events_length; i++ ) {
                event = events[ i ];
                remove_it = false;
                
                if ( namespace !== undefined ) {
                    if ( name !== undefined ) {
                        if ( event.name === name && event.namespace === namespace ) {
                            remove_it = true;
                        }
                    } else {
                        if ( event.namespace === namespace ) {
                            remove_it = true;
                        }
                    }
                } else {
                    if ( name !== undefined ) {
                        if ( event.name === name ) {
                            remove_it = true;
                        }
                    } else {
                        remove_it = true;
                    }
                }
                
                if ( remove_it === true ) {
                    remove_indexes.push( i );
                    break;
                }
            }
            
            events = events.filter( function( event, i ) {
                return remove_indexes.indexOf( i ) < 0;
            } );
            
            events_length = events.length;
        };
        
        this.one = function( name, namespace, callback ) {
            if ( callback === undefined ) {
                callback = namespace;
                namespace = undefined;
            }
            
            namespace = default_namespace || namespace || undefined;
        
            that.on( name, namespace, function( data ) {
                that.off( name, namespace );
                callback( data );
            } );
        };
        
        this.trigger = function( name, data ) {            
            var event,
                i;
                
            name = name || undefined;
            
            for ( i = 0; i < events_length; i++ ) {
                event = events[ i ];
                    
                if ( ( name !== undefined ) ? ( event.name === name ) : true ) {
                    event.callback( data || {} );
                }
            }
        };
    };
    
    window.EventManager = window.EventManager || EventManager;
} )( window, document );