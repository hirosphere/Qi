//  //

import { Leaf } from "../../base/model.js";

//  //

class Component
{
	constructor( args = {}, context )
	{
		this.context = this.make_context( context );
		const def = this.build_def( args );
		this.create( def );
	}

	make_context( context )
	{
		if( context == null )
		{
			context = new AudioContext();
			this.is_root = true;
		}
		return context;
	}

	is_root = false;

	//  //

	build_def( args )
	{
		const type = args.type;
		if( type && typeof type == "function" )
		{
			this.typename = type.name;
			return type( args, this );
		}
	}

	parts = {};
	output = null;
	maked = false;

	create( def = {} )
	{
		const { ctrls, parts, conns, output } = def || {};

		// 

		if( parts )  for( let name in parts )
		{
			const pdef = parts[ name ];
			this.create_part( name, pdef );
		}

		// 

		if( conns )  for( const[ src_path, dest_path ] of conns )
		{
			const src = this.get_object( src_path );
			const dest = this.get_object( dest_path );

			if( src && dest )  src.connect( dest );
			
			// console.log( "conn", src && src.constructor.name, dest && dest.constructor.name );
		}

		// 

		if( ctrls )  for( const def of ctrls )  bind_ctrl( this, def );

		if( output )  this.output = this.get_object( output );
		if( this.is_root && this.output )  this.output.connect( this.context.destination );

		console.log( this );
	}

	create_part( name, def = {} )
	{
		const { type } = def;
		if( type && typeof type == "function" )
		{
			this.parts[ name ] = new Component( def, this.context );
			console.log( "create_part", type.name );
			return;
		}

		const { attrs, params } = def;
		const node_cr = nodes[ type ];
		if( ! node_cr )  return;

		const node = node_cr( this.context );
		if( attrs )  for( let name in attrs )  bind_attrs( node, attrs, name);
		if( params )  for( let name in params )  bind_param( node, params, name );
		this.parts[ name ] = node;
		console.log( "create_part", type );
	}

	get_object( path )
	{
		return this.search_object( path.split( "." ) );
	}

	search_object( list, objs )
	{
		if( list.length == 0 )  return objs || this.output;

		objs = objs || this.parts;

		const name = list.shift();
		const obj = objs[ name ];
		if( obj )
		{
			console.log( "search", list.length, this.typename, name, obj.constructor.name );
			return  obj.is_component ? obj.search_object( list ) : this.search_object( list, obj );
		}

		return objs;
	}

	//  //

	put_msg( msg )
	{
		if( this.do_msg )  this.do_msg( msg );
	}

	activate()
	{
		if( this.context.state == "suspended" )  this.context.resume();
	}

	//  //

	get is_component() { return true; }
}

const bind_param = ( node, values, name ) =>
{
	const param = node[ name ];
	const value = values[ name ];

	 if( param )  param.value = value;
};

const bind_attrs = ( node, values, name ) =>
{
	const value = values[ name ];

	node[ name ] = value;
};

const nodes =
{
	osc: context =>
	{
		const node = new OscillatorNode( context );
		node.start();
		return node;
	},

	gain: context => new GainNode( context ),
};

const bind_ctrl = ( self, def ) =>
{
	const [ src, dest_path, option = {} ] = def;
	const mtov = option.mtov || ( m => m );

	const dest = self.get_object( dest_path );

	if( dest && src && src.is_leaf )
	{
		src.moreview = value => 
		{
			dest.linearRampToValueAtTime( mtov( value ), .1 + self.context.currentTime );
			// console.log( value, self.context.currentTime );
		}
	}
};

//  //

class EG
{

}


//  //

class Synth extends Component
{
	constructor()
	{
		super();
	}

	//  //


}


//  //

export class InstSet extends Component
{
	build_def( args = {} )
	{
		const { model = {} } = args;
		const { master = 0.04, osc_freq = 440 } = model;

		const ctrls =
		[
			[ model.osc_type, "osc1.type", { type: "attr" } ],
			[ model.master, "master.gain", { mtov: v => Math.pow( 2, ( v / 10 ) - 10 ) } ],
		];

		const parts =
		{
			mgosc: { type: "osc", attrs: { type: "triangle" }, params: { frequency: 111.0 } },
			mggain: { type: "gain", params: { gain: -100 } },
			
			mg2osc: { type: "osc", attrs: { type: "triangle" }, params: { frequency: 0.0211 } },
			mg2gain: { type: "gain", params: { gain: 100 } },
			
			osc1: { type: "osc", params: { frequency: osc_freq } },
			master: { type: "gain", params: { gain: 0.04 } },
		};

		const conns =
		[
			[ "mgosc", "mggain" ],
			[ "mggain", "osc1.frequency" ],
			
			[ "mg2osc", "mg2gain" ],
			[ "mg2gain", "osc1.frequency" ],
			
			[ "osc1", "master" ],
		];

		return { parts, conns, output: "master" };
	}

	put_message( msg )
	{
		switch( msg.type )
		{
			case "test-key-on":  this.keyon();  break;
			case "test-key-off":  this.keyoff();  break;
		}
	}

	keyon()
	{
		this.activate();

		let tp = this.context.currentTime;
		const attack = 0.001;
		this.parts.master.gain.cancelAndHoldAtTime( tp );  tp += 0.001;
		this.parts.master.gain.setTargetAtTime( 0.1 , tp, attack );  tp += attack;
	}

	keyoff()
	{
		let tp = this.context.currentTime;
		const decay = 0.001;
		this.parts.master.gain.setTargetAtTime( 0 , tp, decay );
	}
}


//  //

export const create = ( args, context ) =>
{
	return new Component( args, context );
};


export default { create };