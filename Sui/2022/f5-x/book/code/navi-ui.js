import { Leaf } from "../../base/model.js";


//  //

const Link = args =>
{
	const { index, sel, is_head } = args;
	const i_view = sel.get_item( index );

	const br = is_head ?
	{ class: "link -head", key: enter => i_view.select( ! enter ), mk: "↑" } :
	{ class: "link -part", key: enter => i_view.select( enter )  , mk: "↓" };

	const rel =
	{
		type: "span", class: "-rel",
		text: br.mk,
		events:
		{
			mousedown: ev => {  ev.stopPropagation();  i_view.select( ! is_head );  },
			click: ev => ev.preventDefault()
		},
	};

	const mousedown = ev =>
	{
		if( ev.buttons == 1 )
		{
			ev.stopPropagation();
			i_view.select( is_head );	
		}
	};

	const anchor =
	{
		type: "a",
		attrs: { href: i_view.get_link( is_head ) },
		events:
		{
			mousedown,
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
		clist: { _selected_: i_view.selected },
		attrs: { is_root: index.is_root, has_part: index.has_part, test: "5" },
		parts: [ anchor ],
	}

	return li;
}


//  //

const node_view = args => {};

const List = args =>
{
	const { index, sel } = args;

	index.load_parts();

	//  //

	const items =
	{
		model: index.parts,
		def( index ) { return { type: Link, index, sel }; },
	};

	const parts =
	[
		{ type: Link,  index, sel, is_head: true },
		{ type: "ul", class: "-items", parts: items },
	];

	return { type: "ul", class: "list", parts };
}


//  //

const Navi = args =>
{
	const { sel } = args;

	const parts =
	{
		key: sel.curr_head,
		def: index => { return index && { type: List, index, sel }; },
	};

	return { type: "div", class: "navi",  parts };
}


//  //

export { Navi };

