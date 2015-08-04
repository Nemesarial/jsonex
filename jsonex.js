var jsonfile = require( 'jsonfile' );
var fs = require( 'fs' );
var extend = require( 'extend' );

var cp = function( obj ) {
    return extend( true, {}, obj );
};


var jsonUtils = new function() {
    this.shiftDelim = function( str, delim ) {
        if ( !delim ) delim = '.';
        var str = str.split( delim );
        var out = {
            arg: str.shift( 1 ),
            str: str.join( delim )
        };
        return out;
    };

    this.prep = function( mx ) {
        if ( typeof( mx ) == 'object' ) {
            if ( Array.isArray( mx ) ) {
                var ret = [];
                for ( var key in mx ) {
                    ret.push( this.prep( mx[ key ] ) );
                }
                return ret;
            } else {
                var ret = mx === null ? null : {};
                for ( var key in mx ) {
                    var val = this.prep( mx[ key ] );
                    if ( null !== val ) ret[ key ] = val;
                }
                return ret;
            }
        } else return mx == null ? mx : String( mx );
    };
};

var JsonEx = function( json, _stdout, _dump ) {
    var jx = this;
    jx.baseJSON = {};

    jx.stdout = typeof( _stdout ) == 'function' ? _stdout : function() {};
    jx.dump = typeof( _dump ) == 'function' ? _dump : function() {};
    jx.loadedFile;

    jx.setJson = function( json ) {
        if ( fs.existsSync( json ) ) {
            jx.loadFile( json );
        } else {
            jx.baseJSON = jx.parse( json );
        }
    };

    jx.parse = function( json ) {
        if ( typeof( json ) == 'string' ) {
            try {
                json = JSON.parse( jsonUtils.prep( json ) );
            } catch ( e ) {
                json = {};
            }
        } else if ( Array.isArray( json ) && json.length == 2 && typeof json[ 0 ] == 'string' ) {
            var json = jx.set( json[ 0 ], json[ 1 ], {} );
        }
        return json;
    }


    jx.report = function() {
        if ( jx.loadedFile ) jx.stdout( '\n\nJSON Dump for ' + jx.loadedFile )
        if ( arguments.length > 0 ) jx.stdout.apply( jx, arguments );
        jx.dump( jx.baseJSON );
    };

    jx.loadFile = function( filename ) {
        var json;
        try {
            jx.loadedFile = filename;
            json = jsonfile.readFileSync( filename );
        } catch ( e ) {
            jx.stdout( 'ERROR [jsonfile("' + filename + '")]: ' + e.message );
            json = {};
        }
        jx.setJson( json );

    };

    jx.getJson = function() {
        return cp( jx.baseJSON );
    };

    jx.set = function( key, val, target ) {
        if ( !target ) target = jx.baseJSON;
        if ( !target.hasOwnProperty( key ) ) {
            if ( key.indexOf( '.' ) >= 0 ) {
                var dkey = jsonUtils.shiftDelim( key );
                if ( !target.hasOwnProperty( dkey.arg ) ) target[ dkey.arg ] = {};
                jx.set( dkey.str, val, target[ dkey.arg ] );
            } else {
                target[ key ] = val;
            }
        } else {
            target[ key ] = val;
        }
        return target;
    };

    jx.get = function( key, target ) {
        if ( !target ) target = jx.baseJSON;
        if(!key)return cp(target);
        if ( target.hasOwnProperty( key ) ) {
            return cp(target[ key ]);
        } else {
            if ( key.indexOf( '.' ) >= 0 ) {
                var dkey = jsonUtils.shiftDelim( key )
                if ( target.hasOwnProperty( dkey.arg ) && 'object' == typeof target[ dkey.arg ] ) {
                    return jx.get( dkey.str, target[ dkey.arg ] );
                } else {
                    return;
                }
            } else return;
        }
    };

    jx.apply = function( json ) {
        jx.setJson( extend( true, {}, jx.baseJSON, jx.parse( json ) ) );
    };

    jx.extend = function( json ) {
        var jxn = new JsonEx();
        jxn.dump = jx.dump;
        jxn.stdout = jx.stdout;
        var json = jxn.parse( json );
        jxn.setJson( extend( true, {}, jx.baseJSON, json ) );
        return jxn;
    };

    if ( json ) {
        jx.setJson( json );
    }

};

module.exports = {
    JsonEx: JsonEx,
    jsonUtils: jsonUtils
};
