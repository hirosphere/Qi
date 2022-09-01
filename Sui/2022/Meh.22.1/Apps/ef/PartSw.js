import { Leaf, Sel } from "../../Meh/vanil/meh.js";

/*
	パート生成 :
		静的 | ArrayModel同期
		即時 | 選択時

	パート選択 :
		配列番号 | 
*/


//  //

const Range = args =>
{
	const { partSw } = args;
	
	return {
		type: "input",
		props: { type: "range", value: partSw },
		acts: { input( ev ){ partSw.value = ev.target.value - 0 } }
	};
}

const StatOrd = ( args, { rems } ) =>
{
	const contents = [];
	for( let i = 0 ; i < 100; i ++ )
	{
		contents[ i ] = { type: "p", text: "Content " + i };
	}

	const partSw = new Leaf( 0 );

	return {
		type: "div",
		class: "partSw",
		parts: [
			{ type: Range, partSw },
			{ type: Range, partSw },
			partSw.order,
			{ type: "div", parts: contents, partSw }
		],
	};
};


//  //

const OrdeSwitch = ( args, { rems } ) =>
{
	const list = [];
	for( let i = 0 ; i < 100; i ++ )
	{
		list[ i ] = { value: i };
	}

	const sel = new Sel( { listSrc: { parts: list } } );

	const order = new Leaf( 0 );
	rems.bind( order, o => sel.rootIndex.parts[ o ].select() );

	setInterval( () => order.value = order.value < list.length ? order.value + 1 : 0, 1000 );

	return {
		type: "div",
		class: "partSw",
		parts: [
			{ type: "input", attrs: { type: "range", value: order }, acts: { input( ev ){ order.value = ev.target.value - 0 } } },
			{ type: "input", attrs: { type: "range", value: order }, acts: { input( ev ){ order.value = ev.target.value - 0 } } },
			{ type: "input", attrs: { type: "range", value: order }, acts: { input( ev ){ order.value = ev.target.value - 0 } } },
			order,
			{ type: "div",
				parts: {
					model: sel.rootIndex.parts,
					createPart( index ){ return { type: "div", text: index.value, classSw: { selected: index.selected } }; }
				}
			}
		],
	};
};


export default { StatOrd }
