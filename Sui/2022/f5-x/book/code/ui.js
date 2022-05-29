import { Leaf } from "../../base/model.js";


//  //

const Range = args =>
{
	const fix = m => tofix( m, frac );

	const { title, value, unit, max, step, frac = 0, mtov = fix } = args;

	const parts =
	[
		{ type: "label", class: "-title", text: title },
		{
			type: "input", class: "-range",
			attrs: { type: "range", max, value, step },
			events: { input: ev => value.v = ev.target.value }
		},
		{
			type: "span",
			class: "-value-unit",
			parts:
			[
				{ type: "span", class: "-value", text: value.adapt( mtov ) },
				{ type: "span", class: "-unit", text: unit },
			],
		},
	];

	return { type: "div", class: "Range", parts };
};


//  //

const tofix = ( value, frac ) =>
{
	if( frac < 1 )  return Math.round( value );

	const scale = Math.pow( 10, frac );
	const sv = value * scale;
	const round = Math.round( sv ).toString();
	return ( round.slice( 0, - frac ) || "0" ) + "." + round.slice( - frac );	
};


//  //

export { Range };

