const log = console.log;
import { Leaf } from "./model.js";


//  //

class AudioComponent
{
	nodes = {};
	partComponents = {};
	refs = new Refs;

	constructor( def = {}, context )
	{
		this.context = context;
		this.refs = new Refs;

		def = this.expandDef( def );
		this.nodes.main = this.createNode( def );
		this.connectNodes( "main", def );
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
		if( ! Type )  return;

		const node = new Type( this.context );

	//	log( "Create", type )

		const { params, parts } = def;
		if( params )  for( let name in params )  this.refs.bindParam( node, params[ name ], name );
		if( parts )  for( let name in parts )  this.createPart( name, parts[ name ] );

		return node;
	}

	createPart( name, def )
	{
		const { type } = def;
		if( type instanceof Function )
		{
			this.partComponents[ name ] = new AudioComponent( def, this.context );
		}
		else
		{
			this.nodes[ name ] = this.createNode( def );
	//		log( "Part", name )
		}
	}

	connectNodes( name, def )
	{
		const node = this.nodes[ name ];

		let { inputs, params, parts } = def;

		if( inputs ) for( const srcName of inputs )
		{
			const source = this.getSource( srcName )
			log( "Connect", `${ srcName } > ${ name }` );
			source.connect( node );
		}

		if( parts ) for( let partName in parts )
		{
			this.connectNodes( partName, parts[ partName ] );
		}
	}

	getSource( name )
	{
		return this.nodes[ name ];
	}

	terminate()
	{
		this.partComponents.forEach( part => part.terminate() );
		this.refs.terminate();
		this.nodes = null;
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

const primitives =
{
	osc: Osc,
	gain: GainNode,
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

const test = async () =>
{
	const context = new AudioContext;
	try
	{
		await context.audioWorklet.addModule( "sound-proc.js" );
	}
	catch( ex ) { log( ex) }
}

const  create = ( def, context ) =>
{
	if( ! context )
	{
		context = new AudioContext;
		//context.audioWorklet.addModule( "./sound-proc.js" );
		const compo = new AudioComponent( def, context );
		compo.nodes.main?.connect( context.destination );
		return compo;
	}
	return new AudioComponent( def, context );
};

export default { create, test }
