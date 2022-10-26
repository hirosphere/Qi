const log = console.log;
import { Leaf } from "./model.js";


//  //

const starts = new class
{
	set item( item ) { this.items.push( item ) }
	
	go()
	{
		if( this.started ) return;
		this.started = true;
		this.items.forEach( item => item() );
		log( "start !!", this.items.length )
	}

	items = [];
	started = false;
};

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

		const [ ctrldef, partsdef ] = [ def.ctrls, def.parts ];

		if( ctrldef ) for( let name in ctrldef )
		{
			this.createConst( name, ctrldef[ name ] );
		}

		if( partsdef ) for( let name in partsdef )
		{
			this.createPart( name, partsdef[ name ] );
		}

		for( let name in this.parts )
		{
			const part = this.parts[ name ];
			const partdef = partsdef[ name ];
			this.connectPart( part, partdef, name );
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

	// create //

	createConst( name, constdef )
	{
		const node = new GainNode( this.context );
		this.context.constSrc.connect( node );
		this.refs.bindParam2( node.gain, constdef );

		this.parts[ name ] = node;
		
		log( "const", name, node.gain.value )
	}
	
	createPart( name, def )
	{
		const { type } = def;

		const Type = primitives[ type ];
		if( ! Type )  return;

		const node = new Type( this.context );

		const { attrs } = def;
		if( attrs )  for( let name in attrs ) this.refs.bindAttr( node, name, attrs[ name ] );

		this.parts[ name ] = node;
	}

	// connect //

	connectPart( part, partdef, name )
	{
		if( partdef && part instanceof AudioNode )  this.connectNodeInputs( part, partdef, name );
	}
	
	connectNodeInputs( node, nodedef, nodeName )
	{
		const { inputs, params } = nodedef;


		if( inputs ) for( const srcName of inputs )
		{
			this.connectSource( node, srcName );
		}

		if( params ) for( let paramName in params )
		{
			const param = node[ paramName ];
			if( ! param instanceof AudioParam ) break;

			this.connectParamInputs( param, params[ paramName ], { nodeName, paramName } )
		}
	}
	
	connectParamInputs( param, srclist, { nodeName, paramName } )
	{
		if( ! ( srclist instanceof Array ) ) srclist = [ srclist ];
		
		for( const srcspec of srclist ) this.connectParamInput( param, srcspec );
	}

	connectParamInput( param, srcspec )
	{
		if( srcspec?.constructor == String ) this.connectSource( param, srcspec );
		else if( srcspec?.constructor == Number ) param.value = srcspec;
	}
	
	connectSource( target, srcspec )
	{
		const source = this.getSource( srcspec );

		if( source instanceof AudioNode ) source.connect( target );
	}

	getSource( srcspec )
	{
		return this.parts[ srcspec ];
	}

	// public //

	resume()
	{
		const state = this.context.state;
		if( state == "suspended" || state == "interrupted" )
		{
			this.context.resume();
			starts.go();
		}
	}

	terminate()
	{
		this.partComponents.forEach( part => part.terminate() );
		this.refs.terminate();
		this.parts = null;
	}
}

// Node //

class Osc extends OscillatorNode
{
	constructor( context, values )
	{
		super( context, { ... values, frequency: values?.frequency ?? 0 } );
		starts.item = () => this.start();
	}
}

class BqFilter extends BiquadFilterNode
{
	constructor( context, values )
	{
		super( context, { ... values, frequency: values?.frequency ?? 0 } );
	}
}

class Gain extends GainNode
{
	constructor( context, values )
	{
		super( context, { ... values, gain: values?.gain ?? 0 } );
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
	BiquadFilter: BqFilter,
	BQF: BqFilter,
	Gain: Gain,
	Noise: Noise,
};

//  //

class Refs
{
	bindParam( node, name, value )
	{
		if( value == null ) return;

		let opers;
		if( value instanceof Array ) [ value, opers ] = value;

		const param = node[ name ];
		if( ! param )  return;

		const update =
			value => { param.value = opers?.value?.( value ) ?? value; };
		
		this.createRef( value, { update } );
	}

	bindParam2( param, constdef )
	{
		const { src, conv } = constdef;
		if( src == null ) return;

		const update =
			value => { param.value = conv?.( value ) ?? value; };
		
		this.createRef( src, { update } );
	}

	bindAttr( node, name, value )
	{
		this.createRef( value, { update( value ) { node[ name ] = value; } } );
	}

	createRef( value, opers )
	{
		if( value instanceof Leaf ) this.refs.push( value.createRef( opers ) );
		else opers?.update?.( value );
	}

	refs = [];
}


//  //

let context = null;

const getContext = async ( { mehPath } ) =>
{
	if( context )  return context;

	context = new AudioContext;
	context.constSrc = new ConstantSourceNode( context );
	await context.audioWorklet.addModule( `${ mehPath }Meh/sound-proc.js` );

	starts.item = () => context.constSrc.start();

	return context;
};

const  create = ( def, context, connectToDest = true ) =>
{
	return new AudioComponent( def, context, connectToDest );
};

export default { create, getContext }
