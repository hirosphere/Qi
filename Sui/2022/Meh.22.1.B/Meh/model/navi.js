const l = console.log;

import { Tree, Node, Leaf } from "./model.js";

//  //

class Index extends Node
{
	constructor( src = {}, work )
	{
		super( src, work );

		this.title = new Leaf( { value: src.title } );
		this.selected = new Leaf( { value: false } );

		if( src.parts ) this.priv.buildParts( src.parts );

		if( src.selected ) this.select();
	}

	//  //

	get PartClass() { return Index; }

	//  //

	select()
	{
		this.tree.select( this );
	}
}

//  //

class Selector extends Tree
{
	constructor( src )
	{
		super();
		this.current = new Leaf( { value: null, rel: ( n, o ) => this.oncurrchange( n, o ) } );
		this.priv.root = this.createNode( src );
	}

	terminate()
	{
		;
	}

	//  //

	createNode( src ) { return new Index( src, { tree: this } ) }

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
