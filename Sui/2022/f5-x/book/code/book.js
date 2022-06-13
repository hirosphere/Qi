
import { Tree } from "./navi-index.js";
import { Navi } from "./navi-ui.js";


// main //

const Book = args =>
{
	const { index_src, index_types, contentDef } = args;

	const tree = new Tree( { src: index_src, types: index_types } );
	const location = tree.location;

	location.load_url();

	//

	location.on_changed = ( url, index ) =>
	{
		history.replaceState( null, "", url );
		document.title = ( index && index.title + " - " || "" ) + "Book";
	};

	// side //

	const side =
	{
		type: "div", class: "side",
		parts: [ { type: Navi, location }, ]
	};

	// contents //

	const contents =
	{
		type: "div", class: "contents",
		parts:
		{
			key: location.curr_page,
			def: index => contentDef( index, location )
		},
	};

	return { type: "div", class: "book", parts: [ side, contents ] };
};


// exports //

export { Book };

