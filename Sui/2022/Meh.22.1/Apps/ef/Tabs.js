
import { Leaf }  from "../../Meh/vanil/meh.js";

const newTabIndex = ( index, rems ) =>
{
	const tabIndex = new Leaf();
	rems.bind( index.selected, state => { tabIndex.value = state ? 0 : -1 } );
	return tabIndex;
};

const Tab = ( args, { rems } ) =>
{
	const { index } = args;
	const { title, selected, focus } = index;

	const tabIndex = newTabIndex( index, rems );

	return {
		type: "label", class: "Tab",
		classSw: { selected },
		text: title,
		focus,
		attrs: { tabIndex },
		acts: {
			mousedown( ev ){ index.select(); },
			keydown( ev ) {
				switch( ev.key ) {
					case "ArrowLeft": index.getPrev( { clip: true } ).select( { focus: true } ); break;
					case "ArrowRight": index.getNext( { clip: true } ).select( { focus: true } ); break;
					default: return;
				}
				ev.stopPropagation();
			}
		},
	};
};

const Tabs = ( args, { rems } ) =>
{
	const { model } = args;
	const index = model.rootIndex;

	const { focus } = index;
	const tabIndex = newTabIndex( index, rems );

	return {
		type : "ui", class : "Tabs",
		focus,
		attrs : { tabIndex },
		acts: {
			keydown( ev )
			{
				switch( ev.key ) {
					case "ArrowLeft":  { index.parts.last?.select( { focus: true } ); } break;
					case "ArrowRight": { index.parts.first?.select( { focus: true } ); } break;
					default: return;
				}
				ev.stopPropagation();
			}
		},
		parts : {
			model: index.parts,
			createPart( index ) { return { type: Tab, index }; }
		}
	};
};


//  //

export { Tabs };
export default Tabs;

