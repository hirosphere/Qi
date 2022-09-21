const lg = console.log;
const log = lg;

import {  } from "./model.js";

//  //

const Range = ( args ) =>
{
	const { model, title, min, max, step, ex } = args;

	return {
		type: "div",
		class: "Range",
		parts:[
			{ type: "label", class: "title", text: title },
			{ type: "input",
				attrs: { type: "range" },
				props: { value: model, min, max, step },
				acts: {
					input( ev ) { model.set( ev.target.value - 0, ev.target ); }
				}
			},
			{ type: "span", text: model },
			ex && { type: "span", text: [ model, { toRef: ex } ] },
		]
	};
};


//  //

const Item = args =>
{
	const { index } = args;
	const { selected } = index;

	const keydown = ev =>
	{
		// log( ev.key,  index.getNext( { round: true } ) );
		switch( ev.key )
		{
			case "ArrowLeft": break;
			case "ArrowRight": index.getNext( { round: true } )?.select( { focus: true } ); break;
			case "ArrowUp": break;
			case "ArrowDown": break;
			default: return;
		}
		ev.preventDefault();
		return;
	};

	return {
		type: "li", class: "Item",
		text: index.title,
		classSw: { selected },
		props:{ tabIndex: [ selected, { toRef: state => state ? 0 : -1 } ] },
		acts: {
			mousedown( ev ){ index.select(); },
			keydown,
		},
	};
};

const List = ( args, { refs } ) =>
{
	const { index } = args;

	const parts = args.parts || index &&
	{
		model: index.parts,
		part( index ){ return { type: Item, index }; }, 
	};

	return { type: "ul", class: args.class ?? "List", parts };
};

List.Item = Item;

//  //

export { Range, List, }
export default { Range, List, }
