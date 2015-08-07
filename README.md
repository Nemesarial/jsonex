# JsonEx
JSON extender - useful for multi-layer configurations

## Installation
`npm install --save mh_jsonex`  

## Usage
	var JsonEx=require('mh_jsonex').JsonEx;
	var util = require( 'util' );

	var print = function() {
	    for ( var argidx in arguments ) {
	        var arg = arguments[ argidx ];
	        if ( typeof( arg ) == 'object' ) {
	            console.log( util.inspect( arg, {
	                depth: 20
	            } ) );
	        } else {
	            if ( arg ) {
	                console.log( "\n\n" );
	                console.log( arg );
	                console.log( '-----------------------------------' );
	            }
	        }
	    }
	};

	util.inspect.depth = null;

	var j1 = new JsonEx( '{"some":"string"}' );
	var j2 = new JsonEx( __dirname + '/' + 'test.json' );
	var j3 = new JsonEx( {
	    some: 'object'
	} );

	print( 'j1', j1.get() );
	print( 'j2', j2.get() );
	print( 'j3', j3.get() );


	j1.set( 'j2', j2.get() );
	print( "j1.set('j2',j2.get()) :: j1: ", j1.get() );
	j1.set( 'j2.glossary.GlossDiv.j3', j3.get() );
	print( "j1.set('j2.glossary.GlossDiv.j3',j3.get()) :: j1: ", j1.get() );
	print( "j2.get('glossary.GlossDiv')", j2.get( 'glossary.GlossDiv' ) );

	// Creating a new object from an existing object
	var j4 = j1.jsonex( 'j2.glossary' );
	print("var j4 = j1.jsonex( 'j2.glossary' );",j4.get());

	// Applying one config on top of another
	var j5 = j2.jsonex();
	j5.apply( new JsonEx( __dirname + '/' + 'test2.json' ) );
	print( "j5", j5.get() );


