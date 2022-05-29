import { Leaf } from "../../base/model.js";


//  //

const Link = args =>
{
	const { index, location, is_head, keydown } = args;
	const selected = location.get_selected( index );

	//  //

	const tabIndex = new Leaf( -1 );
	selected.moreview = value => tabIndex.value = value ? 0 : -1;

	//  //

	const br = is_head ?
	{ class: "link -head", key: enter => location.select( index, ! enter ), mk: "↑" } :
	{ class: "link -part", key: enter => location.select( index,   enter ), mk: "↓" };

	const rel =
	{
		type: "a", class: "-rel",
		text: br.mk,
		
		attrs:
		{
			href: location.get_link( index, ! is_head ),
			tabIndex,
		},

		events:
		{
			mousedown: ev =>
			{
				if( ev.buttons == 1 )
				{
					ev.stopPropagation();
					location.select( index, ! is_head );	
				}
			},
			click: ev =>
			{
				ev.preventDefault();
			}
		},
	};

	const a =
	{
		type: "a",
		attrs:
		{
			href: location.get_link( index, is_head ),
			tabIndex,
		},

		events:
		{
			mousedown: ev =>
			{
				if( ev.buttons == 1 )
				{
					ev.stopPropagation();
					location.select( index, is_head );
				}
			},
			click: ev => ev.preventDefault(),
			keydown: ev => { if( ev.key == "Enter" ) br.key( ev.shiftKey ); },
		},

		parts:
		[
			{ type: "span", class: "-label", text: index.title },
			rel
		],
	};

	const li =
	{
		type: "li",
		class: br.class,
		clist: { _selected_: selected },
		attrs:
		{
			is_root: index.is_root,
			has_part: index.has_part
		},
		parts: [ a ],
	}

	return li;
}


//  //

const node_view = args => {};

const List = args =>
{
	const { index, location } = args;

	index.load_parts();

	//  //

	const items =
	{
		model: index.parts,
		def( index ) { return { type: Link, index, location }; },
	};

	const path = index.path_mon.slice( 0, -1 );

	const parts =
	[
		{ type: "div", class: "path", text: path.join( " \n" ) },
		{ type: Link,  index, location, is_head: true },
		{ type: "ul", class: "-items", parts: items },
	];

	return { type: "ul", class: "list", parts };
}


//  //

const Navi = args =>
{
	const { location } = args;

	//  //

	const keydown = ev =>
	{
		console.log( ev );
	};

	//  //

	const parts =
	{
		key: location.curr_head,
		def: index => { return index && { type: List, index, location }; },
	};

	const main =
	{
		type: "div",
		class: "navi",
		parts,
		events: { keydown }
	};

	return main;
}


//  //

export { Navi };

