
import { Leaf, Node } from "./model.js";

//  //


class Index extends Node
{
	constructor( initval = {}, args = {} )
	{
		super( initval, args );

		const { title = "", selected = false, value, content } = initval;
		
		this.value = value;
		this.content = content;

		this.title = new Leaf( title );
		this.selected = new Leaf( false );
		this.focus = new Leaf();

		if( selected ) this.select();
	}

	select( { focus = false } = {} )
	{
		this.priv.land.select( this, { focus } );
	}

	selectByPath()
	{
		;
	}

	getPartType( srcvalue ) { return Index; }

	get viewId() { return this.runiq; }
}


//  //

class Selection
{
	constructor( args )
	{
		const { listSrc } = args || {};
		this.currentIndex = new Leaf( null );
		this.path = new Leaf( "" );
		
		this.rootIndex = this.createIndex( listSrc );
	}

	createIndex( initVal )
	{
		return new Index( initVal, { land: this } );
	}

	select( index, { focus } )
	{
		const old = this.currentIndex.value;

		if( index == old ) return;

		if( old ) {
			old.selected.value = false;
		}

		if( index ) {
			index.selected.value = true;
			focus && index.focus.do();
		}

		this.currentIndex.value = index;
	}

	selectByPath( index )
	{
		;
	}

	//

	//

	rootIndex;     // Index //
	currentIndex;  // Leaf < Index > //
}

const Sel = Selection;


//  //

const fromTitles = titles =>
{
	const parts = titles.map( title => ( { title } ) );
	const sel = new Selection( { listSrc: { parts } } );
	sel.rootIndex.select();
	return sel;
};


//  //

export { Selection, Sel, Index, Node };
export default { Selection, fromTitles, Sel, Index, Node };

