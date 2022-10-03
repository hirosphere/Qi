const lg = console.log;
const log = lg;

import { Leaf } from "./model.js";

//  //

const Range = ( args ) =>
{
	const { model, title, unit, min, max, step, ex } = args;
	const ref = Leaf.makeRef( model );

	return {
		type: "div",
		class: "Range",
		parts:[
			{ type: "label", class: "title", text: title },
			{ type: "input", class: "input",
				attrs: { type: "range" },
				props: { value: model, min, max, step },
				acts: {
					input( ev ) { ref.value = ev.target.value - 0; }
				}
			},
			{ type: "span", class: "value", text: model },
			{ type: "span", class: "unit", text: unit },
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
			case "ArrowLeft" : index.getPrev( { round: true } )?.select( { focus: true } ); break;
			case "ArrowRight": index.getNext( { round: true } )?.select( { focus: true } ); break;
			case "ArrowUp": break;
			case "ArrowDown": break;
			case "Escape": index.com?.select( { focus: true } ); break;
			default: return;
		}
		ev.stopPropagation();
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
		focus: index.focus
	};
};

const List = args =>
{
	const { index } = args;
	const { selected } = index;

	const keydown = ev =>
	{
		log( ev.key,  index.parts.first?.id );
		switch( ev.key )
		{
			case " ":
			case "Enter":
			case "ArrowDown":
			case "ArrowRight" : index.parts.first?.select( { focus: true } ); break;
			case "ArrowUp":
			case "ArrowLeft": index.parts.last?.select( { focus: true } ); break;
			default: return;
		}
		ev.stopPropagation();
		ev.preventDefault();
		return;
	};

	const tabIndex = [ selected, { toRef( state ) { return state ? 0 : -1 } } ];

	return {
		type: "ul",
		class: args.class ?? "List",
		props: { tabIndex: [ selected, { toRef( state ) { return state ? 0 : -1 } } ] },
		acts: { keydown },
		focus: index.focus,
		parts: args.parts || index &&
		{
			model: index.parts,
			part( index ){ return { type: Item, index }; }, 
		},
	};
};

List.Item = Item;

//  //

export { Range, List, }
export default { Range, List, }
