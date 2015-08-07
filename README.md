# JsonEx
JSON extender - useful for multi-layer configurations

## Installation
`npm install --save mh_jsonex`  

## Usage
	var JsonEx=require('mh_jsonex').JsonEx;
	var j1=JsonEx('{"some":"string"}');
	var j2=JsonEx('../some/file/name.json');
	var j3=JsonEx({some:'object'});

