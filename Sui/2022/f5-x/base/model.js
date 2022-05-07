
//  //

class Leaf
{
	constructor( initv, rel )
	{
		this.priv.value = this.priv.next = initv;
		if( rel ) this.priv.views.push( rel );
	}

	//  //

	set moreview( view )
	{
		this.priv.views.push( view );
		view( this.priv.value, undefined, true );  // new_v, old_v, is_init //
	}

	set enter( value )
	{
		if( ! value )  return;

		const old_v = this.priv.value;
		const new_v = this.priv.value = this.priv.next;
		for( const view of this.priv.views )  view( new_v, old_v );
	}

	adapt( mtov = v => v )
	{
		const adaptor = new Leaf( this.v );
		this.moreview = v => { adaptor.v = mtov( v ); };
		return adaptor;
	}

	attach( target, name )
	{
		this.moreview = value => { target[ name ] = value; };
	}

	//  //

	set v( new_v ) { this.value = new_v; }
	get v() { return this.priv.value; }

	set value( new_v )
	{
		if( new_v === this.priv.value )  return;

		const old_v = this.priv.value;
		this.priv.value = new_v;
		for( const view of this.priv.views )  view( new_v, old_v );
	}

	get value() { return this.priv.value; }

	// 

	static make( v, def_v )
	{
		if( v && v.is_leaf )  return v;
		return new Leaf( v !== undefined ? v : def_v );
	}

	get is_leaf() { return true }

	toString() { return String( this.v ); }

	//  //

	priv = { value: undefined, next: undefined, views: [] };
}


//  //

const array_notify = ( ar, args ) =>
{
	for( const view of ar.views )  view( args );
};

class ArrayModel extends Array
{
	set moreview( view )
	{
		this.views.push( view );
		view( { type: "bind", values: this } );
	}

	add( items )
	{
		this.splice( this.length, 0, ... items );
		array_notify( this, { type: "insert", start: 0, count: items.length } );
	}

	views = [];
};


//  //

let ru_ctr = 1;
const next_ru = obj => { obj.ru = obj.ru || "ru-" + ru_ctr ++ };

//  //

export { Leaf, ArrayModel, next_ru };

