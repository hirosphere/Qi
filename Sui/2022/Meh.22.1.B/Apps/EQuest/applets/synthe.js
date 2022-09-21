
import { Range, Branch, Leaf } from "../../../Meh/meh.js";
const log = console.log;

const Synthe = { Model: {}, UI: {} };

Synthe.Model.EG = class extends Branch
{
	static def =
	{
		vars:
		{
			attack: Number,
			decay: Number,
			sustain: Number,
			release: Number
		},

		default: { attack: 0, decay: 0, sustain: 30, release: 0 },
	};
}

Synthe.Model.SyntheA = class
{
	eg = new Synthe.Model.EG();
}


const UI = {};

const pow = value => Math.round( 100 * Math.pow( 2, value / 12 ) ) / 100;

Synthe.UI.EG = args =>
{
	const { model } = args;
	
	const range = { min: -120, max: 120, step: 1 };
	const ex = value => ( value > 0 ? `1/${ pow( value ) }` : `${ pow( 0 - value ) }` ) + "sec";

	return {
		type: "div", class: "EG Ranges",
		parts:[
			{ type: Range, title: "Attack", model: model.attack, ...range, ex },
			{ type: Range, title: "Decay", model: model.decay, ...range, ex },
			{ type: Range, title: "Sustain", model: model.sustain },
			{ type: Range, title: "Release", model: model.release, ...range, ex },
		]
	};
};

Synthe.UI.SyntheA = args =>
{
	const { model = new Synthe.Model.SyntheA } = args;

	return {
		type: "div", class: "Applet Synthe SyntheA",
		parts:[
			{ type: "h2", text: "Synthe type A" },
			{ type: Synthe.UI.EG, model: model.eg },
		]
	};
};

//  //

export default Synthe;
