
import { Tree, Node, Leaf } from "./model.js";
const log = console.log;

//  //

class Index extends Node
{
	constructor( srcValue, inits = {} )
	{
		super( srcValue, inits );

		this.title = new Leaf.String( srcValue.title ?? "" );
		this.selected = new Leaf.Boolean( false );

		const { tree } = this.priv;
		srcValue?.selected && tree.select( this );
	}

	//  //

	get tree() { return this.priv.tree; }
	
	//  //

	select( option )
	{
		this.tree.select( this, option )
	}

	getNext( option )
	{
		log( this.next + "" )
		return this.next;
	}

	//  //

}


//  //

class Selector extends Tree
{
	constructor( srcValue, options )
	{
		super( srcValue, options );

		this.current = new Leaf.Object
		(
			null,
			{ rel: ( ni, oi ) => this.#onCurrChange( ni, oi ) }
		);

		this.build( srcValue );
	}

	//  //

	get defaultNode() { return Index; }


	//  //

	select( index, options = {} )
	{
		this.current.value = index;

		const { focus } = options;
	}

	getNext( option )
	{
		return this.next;
	}


	//  //

	#onCurrChange( newIndex, oldIndex )
	{
		if( oldIndex )  oldIndex.selected.value = false;
		if( newIndex )  newIndex.selected.value = true;
	};


}


//  //

export { Selector, Index }
export default { Selector, Index }
