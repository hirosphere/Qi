import { Leaf } from "../../meh/index.js";

const log = console.log;

export const create = ( args : Args.Component, ac : AudioContext, dest ? : AudioNode ) =>
{
	const compo = new Component( args, ac );

	if( compo.output.main ) compo.output.main.connect( dest ?? ac.destination );
}

//  //

export namespace Args
{
	export interface Component
	{
		output : Output ;
		constants ? : Record < string, Constant > ;
		nodes : Record < string, Node > ;
	}

	export type Constant =
	{
		value : Leaf.LoL.Number ;
		time ? : number ;
		gain ? : number ;
		cv ? : ( value : number ) => number ;
	}

	type Output =
	{
		main: SrcSpec,
		[ key : string ] : SrcSpec ;
	}

	export interface Node
	{
		type : NodeType | Component ;
		sources ? : SrcSpec[] ;
		params ? : Params ;
	}

	export type Params = Record < string, ParamSrc[] >;
	export type ParamSrc = number | SrcSpec ;

	export type SrcSpec = string ;
}

type NodeType = "Osc" | "Gain";

//  //

class Component
{
	output : Record < string, AudioNode > = {};
	nodes : Record < string, AudioNode > = {};

	constructor( args : Args.Component, private ac : AudioContext )
	{
		if( args.constants )
		{
			for( let name in args.constants )  this.createConst( name, args.constants[ name ] );
		}

		if( args.nodes )
		{
			for( let name in args.nodes ) this.createNode( name, args.nodes[ name ] );
			for( let name in args.nodes )  this.connectNodeSrc( name, args.nodes[ name ] );
		}

		if( args.output )  for( let name in args.output )  this.setupOutput( name, args.output[ name ] );
	}

	//  //

	setupOutput( name : string, spec : Args.SrcSpec )
	{
		const node = this.getSource( spec );
		if( node ) this.output[ name ] = node;
	}

	createConst( name : string, args : Args.Constant )
	{
		const node = this.ac.createConstantSource();
		const lol = args.value;

		if( lol instanceof Leaf.Number )
		{
			const update = () =>
			{
				const curr = this.ac.currentTime;
				const len = args.time ?? 0.01;
				const value =
				(
					args.cv ?
						args.cv( lol.value ) :
						lol.value * ( args.gain ?? 1 )
				);
				node.offset.cancelAndHoldAtTime( curr );
				node.offset.setTargetAtTime( value, curr, len );
			}

			node.offset.value = 0;
			lol.createRef( update );
		}

		else if( typeof lol == "number" )  node.offset.value = lol;

		this.nodes[ name ] = node;
		node.start();
	}

	createNode( name : string, args : Args.Node )
	{
		if( typeof args.type != "string" )
		{
			new Component( args.type, this.ac );
			return;
		}

		const nf = NF[ args.type ];
		if( ! nf ) return;
		
		this.nodes[ name ] = nf( args, this.ac );
	}

	//  //

	connectNodeSrc( name : string, args : Args.Node )
	{
		const node = this.nodes[ name ];
		if( ! node ) return;

		if( args.sources ) for( let srcspec of args.sources )
		{
			this.connect( node, srcspec );
		}

		if( args.params ) this.connectParams( node, args.params )
		
	}

	connectParams( node : AudioNode, args : Args.Params )
	{
		for( let paramName in args )
		{
			for( const paramSrc of args[ paramName ] )
			{
				this.connectParam( node, paramName, paramSrc );
			}
		}
	}

	connectParam( node: any, paramName : string, src : Args.ParamSrc )
	{
		const param = node[ paramName ];
		if( ! ( param instanceof AudioParam ) ) return;

		if( typeof src == "number" )
		{
			log( "param", paramName, src );

			param.value= src;
		}

		else
		{
			const source = this.getSource( src );
			if( source ) source.connect( param );

			log( "param", { paramName, src }, source?.constructor.name );
		}
	}

	connect( node : AudioNode, srcspec : Args.SrcSpec )
	{
		const source = this.getSource( srcspec );
		if( source )  source.connect( node );
	}

	getSource( spec : Args.SrcSpec ) : AudioNode | void
	{
		const names = spec.split( "." );

		const name = names.shift();
		const node = this.nodes[ name ?? "" ];

		// log( "get !", name, node != null );

		if( node ) return node;
	}
}

type NodeFactory = ( args :  Args.Node, ac : AudioContext ) => AudioNode;

const NF : Record < NodeType, NodeFactory > =
{
	"Osc"( args :  Args.Node, ac : AudioContext )
	{
		const node = ac.createOscillator();
		node.start();
		return node;
	},

	"Gain"( args :  Args.Node, ac : AudioContext )
	{
		const node = ac.createGain();
		node.gain.value = 0;
		return node;
	},
};
