
import { Tree } from "./navi-index.js";
import { Navi } from "./navi-ui.js";

import { Top } from "./page/top/top.js";
import Train from "./page/train/train.js";
import { Eval } from "./page/eval/eval.js"
import UIskt from "./page/ui-sketch/ui-sketch-1.js";
import Eki from "./page/eki.js";


// page content //

const DefaultContent = args =>
{
	const { index } = args;

	const path = index.path.slice( 0, -1 );

	const parts =
	[
		{ type: "h1", text: index.title, },
		{ type: "p", text: path.map( i => i.title.value ).join( " > " ) },
		{ type: "p", text: "-- Content --", style: { color: "hsl( 50, 3%, 75% )" } },
	];

	return { type: "div", class: "content", parts };
};


const content_types =
{
	"Top": Top,
	"Eval": Eval,
	"Train": Train.Main,
	"UI-Sketch": UIskt.Main,
};


const get_named_content_def = index =>
{
	const type = content_types[ index.type ] || DefaultContent;
	return { type, index };	
};


const get_content_def = ( index, location ) =>
{
	return index &&
	(
		index.get_content_def( location ) ||
		get_named_content_def( index )
	)
	|| null;
};


// index //

const index_types =
{
	"Eki": Eki.RootIndex,
};


// main //

const Book = args =>
{
	const { index_src } = args;
	const tree = new Tree( index_src, index_types );
	const location = tree.location;

	location.load_url();

	//

	location.on_changed = ( url, index ) =>
	{
		history.replaceState( null, "", url );
		document.title = ( index && index.title + " - " || "" ) + "Book";
	};

	//

	const side =
	{
		type: "div", class: "side",
		parts: [ { type: Navi, location }, ]
	};

	const contents =
	{
		type: "div", class: "contents",
		parts:
		{
			key: location.curr_page,
			def: index => get_content_def( index, location )
		},
	};

	return { type: "div", class: "book", parts: [ side, contents ] };
};


// exports //

export { Book };

