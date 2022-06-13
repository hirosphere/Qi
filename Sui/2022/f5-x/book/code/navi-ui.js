import { Leaf } from "../../base/model.js";


//  //

const make_tab_index = index =>
{
	const leaf = new Leaf();
	index.selected.view = value => leaf.value = ( value ? 0 : -1 ); 
	return leaf;
};

const Link = args =>
{
	const { index, is_head = false, tabIndex, keydown, text, parts } = args;

	const events = {};

	events.mousedown = ev =>
	{
		if( ev.buttons == 1 )
		{
			ev.stopPropagation();
			index.select( is_head );
		}
	};

	events.click = ev =>
	{
		ev.preventDefault();
	};

	events.keydown = ev =>
	{
		if( ev.key == "Enter" ) index.select( is_head );
	};

	const attrs =
	{
		href: index.get_link( is_head ),
		tabIndex,
	};

	return { type: "a", class: args.class, text, parts, attrs, events, };
};

const ListItem = args =>
{
	const { index, parts } = args;
	
	//  //
	
	const attrs =
	{
		selected : index.selected,
		has_part: index.has_part,
	};
	
	return { type: "li", attrs, parts };
};

const PathItem = args =>
{
	const { index } = args;

	const label = { type: "span", class: "label", text: index.title };

	const content =
	{
		type: Link,
		is_head: true,
		parts: [ label ],
		index, tabIndex: 0,
	};

	return { type: ListItem, index, parts: [ content ] };
};

const CollItem = args =>
{
	const { index } = args;

	//  //

	const label = { type: "span", class: "label", text: index.title };
	const tabIndex = make_tab_index( index );

	const rel =
	{
		type: Link,
		class: "-rel",
		text: "⇒",
		is_head: true,
		location,
		index, tabIndex
	};

	const content =
	{
		type: Link, index, tabIndex, parts: [ label, rel ],
	};

	return { type: ListItem, index, parts: [ content ] };
}


//  //

const select = ( index, is_head = false ) => index && index.select( is_head );
// const select = ( index, is_head = false ) => console.log( index && index.title.v || null );

const List = args =>
{
	const { index } = args;

	index.fetch();

	//  //

	const coll_keydown = ev =>
	{
		const curr = index.tree.location.curr_page.value;
		curr && console.log( "coll", ev.key, curr.title.v,  curr.next != null );
		switch( ev.key )
		{
			case "ArrowDown": select( curr && curr.next ) ;  break;
			case "ArrowUp":   select( curr && ( curr.prev || curr.composition ) ) ;  break;
			default: return;
		}
		ev.preventDefault();
	};

	//  //

	const path =
	{
		type: "ul",
		class: "path",
		parts:
		{
			model: index.path,
			def( index ) { return { type: PathItem,  text: index.title,  index }; }
		}
	};

	const colls =
	{
		type: "ul",
		class: "colls",
		events: { keydown: coll_keydown },
		parts:
		{
			model: index.parts,
			def( index ) { return { type: CollItem, index }; },
		}	
	};

	return { type: "ul", class: "list", parts: [ path, colls ] };
}


//  //

const Navi = args =>
{
	const { location } = args;

	//  //

	const parts =
	{
		key: location.curr_head,
		def: index => { return index && { type: List, index, location }; },
	};

	return { type: "div", class: "navi", parts, };
}

//

//	.navi
//	.navi > .list
//	.navi > .list > .path
//	.navi > .list > .colls


//  //

export { Navi };

