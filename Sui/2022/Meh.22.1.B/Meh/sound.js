const log = console.log;
import { Leaf } from "./model.js";


//  //

class AudioComponent
{
	parts = {};
	partComponents = {};
	refs = new Refs;

	constructor( def = {}, context, connectToDest )
	{
		this.context = context;
		this.refs = new Refs;

		def = this.expandDef( def );

		if( def.parts ) for( let name in def.parts )
		{
			this.createPart( name, def.parts[ name ] );
		}

		for( let name in this.parts )
		{
			this.connectInputs( name, def.parts[ name ] );
		}

		connectToDest && this.parts.main?.connect( context.destination )
	}

	expandDef( def )
	{
		if( def?.type instanceof Function )
		{
			return this.expandDef( def.type( def ) );
		}

		return def;
	}
	
	createPart( name, def )
	{
		const { type } = def;

		const Type = primitives[ type ];
		if( ! Type )  return;

		const node = new Type( this.context );

		log( "Create", type )

		const { params } = def;
		if( params )  for( let name in params )  this.refs.bindParam( node, params[ name ], name );

		this.parts[ name ] = node;
	}

	connectInputs( name, def )
	{
		const part = this.parts[ name ];

		log( part, name )

		if( part instanceof AudioNode )
		{
			let { inputs, params } = def;

			if( inputs ) for( const srcName of inputs )
			{
				this.connectInput( part, srcName );
				log( "Connect", `${ srcName } > ${ name }` );
			}	
		}
	}

	connectInput( object, srcName )
	{
		const source = this.getSource( srcName );
		source?.connect( object );
	}

	getSource( srcName )
	{
		return this.parts[ srcName ];
	}

	terminate()
	{
		this.partComponents.forEach( part => part.terminate() );
		this.refs.terminate();
		this.parts = null;
	}

	//  //

	resume()
	{
		const state = this.context.state;
		if( state == "suspended" || state == "interrupted" )
		{
			this.context.resume();
		}
	}

}

class Osc extends OscillatorNode
{
	constructor( context )
	{
		super( context );
		this.start();
	}
}

class Noise extends AudioWorkletNode
{
	constructor( context )
	{
		super( context, "Noise" );
	}
}

const primitives =
{
	Osc: Osc,
	Gain: GainNode,
	Noise: Noise,
};

//  //

class Refs
{
	bindParam( node, value, name )
	{
		if( value == null ) return;

		let opers;
		if( value instanceof Array ) [ value, opers ] = value;
	//	log( "Bind", { name, value, opers } )

		const param = node[ name ];
		if( ! param )  return;

		const update =
			value => { param.value = opers?.value?.( value ) ?? value; };
		
		if( value instanceof Leaf )  value.createRef( { update } );
		else update( value );
	}

	refs = [];
}


//  //

let context = null;

const getContext = async ( { mehPath } ) =>
{
	if( context )  return context;

	context = new AudioContext;
	await context.audioWorklet.addModule( `${ mehPath }Meh/sound-proc.js` );

	return context;
};

const  create = ( def, context, connectToDest = true ) =>
{
	return new AudioComponent( def, context, connectToDest );
};

export default { create, getContext }
