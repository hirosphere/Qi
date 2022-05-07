
import { Tree } from "./navi-index.js";
import { Navi } from "./navi-ui.js";

import { Top } from "./page/top/top.js";
import { Eval } from "./page/eval/eval.js"
import Eki from "./page/eki.js";

//  //

const Content = args =>
{
	const { index } = args;

	const parts =
	[
		{ type: "h1", text: index.title, },
		{ type: "p", text: index.path },
	];

	return { type: "div", class: "content", parts };
};


const content_types =
{
	Top: Top,
};


const create_content_def = index =>
{
	if( ! index ) return null;

	const type = content_types[ index.type ];
	console.log( type && type.name || "", index && index.title.value, content_types );
	if( type ) return { type, index };
	
	return index && { type: Content, index };
};


const index_types =
{
	"Eki": Eki.RootIndex,
};


const Book = args =>
{
	const { index_src } = args;
	const tree = new Tree( index_src, index_types );
	const sel = tree.new_selection();

	( async () => await sel.load_url() )();

	//

	sel.curr_page.moreview = index =>
	{
		history.replaceState( null, "", sel.url.value );

		document.title = ( index && index.title + " - " || "" ) + "Book";
	};

	//

	const side =
	{
		type: "div", class: "side",
		parts: [ { type: Navi, sel }, ]
	};

	const contents =
	{
		type: "div", class: "contents",
		parts:
		{
			key: sel.curr_page,
			def: create_content_def
		},
	};

	return { type: "div", class: "book", parts: [ side, contents ] };
};


//  //

export { Book };

