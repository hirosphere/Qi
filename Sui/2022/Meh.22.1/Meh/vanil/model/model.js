
//  //

let nextVId = 1;


export class Leaf
{
	constructor( initialValue, args = {} )
	{
		const { rel } = args;
		this.priv.value = initialValue;
		if( rel ) this.addView( rel, false );
	}

	//  //

	static make( value ) { return Leaf.isLeaf( value ) ? value : new Leaf( value ); }
	static value( x ) { return x instanceof Leaf ? x.value : x; }
	static isLeaf( obj ) { return obj instanceof Leaf; }

	//  //

	addView( view, init = true )
	{
		const vid = nextVId ++;
		this.priv.views[ vid ] = view;
		if( init ) view( this.priv.value );
		return () => delete this.priv.views[ vid ];
	}

	//  //

	set value( new_value )
	{
		if( new_value === this.priv.value ) return;

		const old_value = this.priv.value;
		this.priv.value = new_value;

		this.notify( new_value, old_value );
	}

	get value()
	{
		return this.priv.value;
	}

	notify()
	{
		for( let ru in this.priv.views ) this.priv.views[ ru ]( ... arguments );
	}

	do()
	{
		for( let ru in this.priv.views ) this.priv.views[ ru ]( ... arguments );
	}

	//  //

	priv = { views: {}, value: undefined };
}

export class Rems
{
	bind( value, view )
	{
		if( value instanceof Leaf || value instanceof ArrayModel ) this.rems.push( value.addView( view ) );
		else view( value );
	}

	add( view )
	{
		this.rems.push( view );
	}

	do()
	{
		this.rems.forEach( rem => { console.log( rem ) } );
		this.rems = [];
	}

	rems = [];
}

//  //

export class Branch
{
}

Branch.newType = def =>
{
	const { vars, rels, update, methods } = def || {};

	const type = class extends Branch
	{
		constructor( values )
		{
			super();
			makeFields( this, vars, rels, values, update );
		}
	};

	if( methods ) for( let name in methods ) type.prototype[ name ] = methods[ name ];

	return type;
};

const makeFields = ( branch, fields, rels, values, update = ()=>{} ) =>
{
	const rel = new_value =>
	{
		const src = {};
		for( let name in fields ) src[ name ] = branch[ name ].value;
		const res = update( src );
		for( let name in rels ) if( name in res ) branch[ name ].value = res[ name ];
	};
	
	for( let name in fields ) { branch[ name ] = makeField( fields[ name ], values[ name ], rel ); }
	for( let name in rels )   { branch[ name ] = makeField( rels[ name ] ); }

	rel();
};

const makeField = ( def, value, rel ) =>
{
	return new Leaf( value, { rel } );
};

//  //

export class ArrayModel extends Array
{
	//  //
	
	addView( view )
	{
		const vid = nextVId ++;
		this.priv.views[ vid ] = view;
		view.bind && view.bind();
		return () => delete this.priv.views[ vid ];
	}

	//  //

	get first() { return this[ 0 ] || null; }
	get last() { return this[ this.length - 1 ] || null; }

	//  //

	push( value )
	{
		super.push( value );
	}

	pop()
	{
		super.pop();
	}

	shift()
	{
		super.shift();
	}

	unshift( value )
	{
		super.unshift( value );
	}

	splice( index, count, add )
	{
		super.splice( index, count, add );
	}

	priv = { views: {} };
}


//  //

export class Node
{
	constructor( initval = {}, args = {} )
	{
		this.priv.com = args.com;
		this.priv.land = args.land || null;
		this.priv.runiq = runiq.next();
		this.priv.order = new Leaf( args.order );
		this.priv.name = initval.name ?? this.runiq;
		const { parts } = initval;
		parts && parts.forEach( ( initval, order ) => this.createPart( initval, order ) );
	}

	get runiq() { return this.priv.runiq; }
	get com() { return this.priv.com; }
	get order() { return this.priv.order; }
	get name() { return this.priv.name; }
	get parts(){ return this.priv.parts; }

	getPrev( { clip, ring } )
	{
		const colls = this.com && this.com.parts;
		return colls && ( colls[ this.order.value - 1 ] || clip && colls.first || ring && colls.last ) || null;
	}

	getNext( { clip, ring } )
	{
		const colls = this.com && this.com.parts;
		return colls && ( colls[ this.order.value + 1 ] || clip && colls.last || ring && colls.first ) || null;
	}

	//  //

	getPartType( srcvalue ) { return Node; }

	createPart( initval, order )
	{
		const { land } = this.priv;
		const Type = this.getPartType( initval );
		this.priv.parts.push( new Type( initval, { land, com: this, order } ) );
	}

	priv =
	{
		parts: new ArrayModel(),
		partbyname: {}
	};

	//

	toString() { return this.runiq; }
}


//  //

export const runiq = new function()
{
	let next = 1;
	
	const rand_ch = () =>
	{
		const rand = Math.floor( Math.random() * ( 10 + 27 + 27 ) );
		const code = ( rand < 10 ? 0x30 + rand : rand < 37 ? rand - 10 + 0x40 : rand - 37 + 0x60 );
		return String.fromCharCode( code );
	};

	this.next = () => `${ next ++ }-????`.replace( /\?/g, m => rand_ch() );
};


//  //

export default { Leaf, Branch, ArrayModel, Node }
