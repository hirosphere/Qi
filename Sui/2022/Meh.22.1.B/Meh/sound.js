const log = console.log;
import {  } from "./model.js";


//  //

class AudioComponent
{
	constructor( def = {}, ac )
	{
		this.context = ac  || new AudioContext();
		this.nodes.main = this.createNode( this.expandDef( def ) );
	}

	expandDef( def )
	{
		const { type } = def;

		if( type instanceof Function )
		{
			return this.expandDef( type( def ) );
		}
		return def;
	}

	createNode( def )
	{
		const { refs } = this;
		
		const { type } = def;

		const Type = primitives[ type ];
		if( ! Type )  return null;

		const node = new Type( this.context );

		const { params } = def;
		if( params ) for( let name in params ) this.refs.bindParam( node, params, name );

		return node;
	}

	terminate()
	{
		this.partComponents.forEach( part => part.terminate() );
		this.refs.terminate();
		this.nodes = null;
	}

	nodes = {};
	partComponents = [];
	refs = new Refs;

}

const primitives =
{
	osc: OscillatorNode,
	gain: GainNode,
};

//  //

class Refs
{
	bindParam( node, values, name )
	{
		let value = values[ name ];
	}

	refs = [];
}


//  //

const  create = ( def, audioContext ) =>
{
	return new AudioComponent( def, audioContext );
};

export default { create }
