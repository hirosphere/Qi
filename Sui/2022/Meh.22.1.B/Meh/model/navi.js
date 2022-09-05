const l = console.log;

import { Tree, Node, Leaf } from "./model.js";

//  //

class Index extends Node
{
	constructor( args = {}, work )
	{
		super( args, work );

		this.tree = work.tree;

		this.title = new Leaf( { value: args.title } );
		this.selected = new Leaf( { value: false } );

		if( args.parts ) this.priv.buildParts( args.parts );

		//if( args.selected ) this.select();
	}

	//  //

	select()
	{
		this.tree.select( this );
	}
}

//  //

class Selector extends Tree
{
	constructor( args )
	{
		super( args );

		this.current = new Leaf( { value: null, rel: ( n, o ) => this.oncurrchange( n, o ) } );

	}

	terminate()
	{
		;
	}

	get Node() { return Index; }

	//  //

	select( index, option )
	{
		this.current.value = index;
	}

	oncurrchange( newIndex, oldIndex )
	{
		l( newIndex?.title.value, oldIndex?.title.value );
		if( oldIndex ) oldIndex.selected.value = false;
		if( newIndex ) newIndex.selected.value = true;
	}
}

//  //

export { Selector };
export default { Selector };
