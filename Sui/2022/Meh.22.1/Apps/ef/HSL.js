
import { Leaf, Branch } from "../../Meh/vanil/meh.js";

//  //

const Range = ( { label, model, unit = "", max } ) =>
{
	return {
		type: "div", class: "Range",
		parts:[
			{ type: "label", class: "label", text: label },
			{ type: "input",
				attrs:{ type: "range", max, value: model },
				acts:{
					input: ev => Leaf.make( model ).value = ev.target.value - 0
				}
			},
			{ type: "span", class: "vu",
				parts:[
					{ type: "span", class: "value", text: model },
					{ type: "span", class: "unit", text: unit },
				]
			},
		]
	};
};

const HSL = Branch.newType
(
	{
		vars:
		{
			hue: Number,
			sat: Number,
			light: Number
		},
		rels:
		{
			css: String,
		},
		update: ( { hue, sat, light } ) =>
		{
			return { css: `hsl( ${ hue }, ${ sat }%, ${ light }% )` }
		},
		methods:
		{
			toString() { return this.css.value }
		}
	}
);


const HSLCtrl = ( { color } ) =>
{
	return {
		type: "div", class: "HSLCtrl",
		parts:[
			{ type: Range, label: "Hue", model: color.hue, max: 360 },
			{ type: Range, label: "Sat", model: color.sat },
			{ type: Range, label: "Light", model: color.light },
		]
	};
};

const HSLApp = ( { color } ) =>
{
	return {
	  type: "div", class: "HSLApp",
	  parts:
	  [
	    { type: "div", class: "HSLDisp", text: color.css, style: { background: color.css } },
		{ type: HSLCtrl, color },	
	  ]
	};
};

const HSLPage = args =>
{
	return {
		type: "div", class: "HSLPage",
		parts:[
			{ type: "h1", text: "HSL" },
			{ type: HSLApp, color: args.model.color1 },
			{ type: HSLApp, color: args.model.color2 },
			{ type: HSLApp, color: args.model.color3 },
		]
	};
};

//  //

export { HSLPage, HSL };

