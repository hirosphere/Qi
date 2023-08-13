
import { Tree, Node, Leaf, Action } from "./model.js";
const log = console.log;

//  //

class Index extends Node
{
	constructor( srcValue = {}, inits = {} )
	{
		super( srcValue, inits );

		this.title = new Leaf.String( srcValue.title ?? "" );
		this.selected = new Leaf.Boolean( false );
		this.focus = new Action;
		this.content = srcValue.content;

		const { tree } = this.priv;
		srcValue?.selected && tree.select( this );
	}

	//  //

	get tree() { return this.priv.tree; }
	
	get key() { return "key+" + this.id; }
	
	//  //

	select( option )
	{
		this.tree.select( this, option )
	}

	getNext( option )
	{
		return this.next;
	}

	getPrev( option )
	{
		return this.prev;
	}

	//  //

}


//  //

class Selector extends Tree
{
	constructor( srcValue, options )
	{
		super( { defaultNode: Index, ... options } );

		this.current = new Leaf.Object
		(
			null,
			{ rel: ( ni, oi ) => this.#onCurrChange( ni, oi ) }
		);

		this.build( srcValue );
	}

	// URL , Location //

	updateLocation( index )
	{
		;
	}

	// select //

	select( index, options = {} )
	{
		this.current.value = index;

		const { focus } = options;
		focus && index?.focus.do();
	}

	// protected //

	#onCurrChange( newIndex, oldIndex )
	{
		if( oldIndex )  oldIndex.selected.value = false;
		if( newIndex )  newIndex.selected.value = true;
	};
}


//  //

class Page
{
	constructor( args = {} )
	{
		this.title = new Leaf.String( args.title );
		this.query = new Leaf.Object( null );
	}
}


//  //

class Location
{
	constructor( args = {} )
	{
		this.args = args;
		this.priv =
		{
			title: "",
			url: "",
			timeout: null
		};

		this.index = new Leaf.Object( args.index, {} );
		this.page = new Leaf.Object( args.page, {} );
	
		this.#update();
	}

	makeQuery( page )
	{

	}

	#update()
	{
		const { title } = this.args?.update?.( { index: this.index.value, page: this.page.value } );

		document.title = title;
	}
}


//  //

export { Selector, Index, Location, Page }
export default { Selector, Index, Location, Page }
