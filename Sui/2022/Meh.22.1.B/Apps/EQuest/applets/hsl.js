
import { Branch, Leaf, Range, log } from "../../../Meh/meh.js";

const HSL = { Model: {}, UI: {} };

HSL.Model.HSL = class extends Branch
{
	static def =
	{
		default: { hue: 100, sat: 55, light: 65 },

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
		
		update( { hue, sat, light } )
		{
			return { css: `hsl( ${ hue }, ${ sat }%, ${ light }% )` };
		},
	};
}


HSL.UI.Ranges = args =>
{
	const { model } = args;

	return {
		type: "div",
		class: "Ranges",
		parts:[
			{ type: Range, title: "Hue", model: model.hue, unit: "", max: 360 },
			{ type: Range, title: "Sat", model: model.sat, unit: "%" },
			{ type: Range, title: "Light", model: model.light, unit: "%" },
		]
	}
};

HSL.UI.AppletA = args =>
{
	const { model } = args;

	return {
		type: "div",
		class: "Applet HSLAppletA",
		parts: [
			{ type: "h2", text: "HSL" },
			{
				type: "div", class: "display",
				text: model.css,
				style: { background: model.css },
			},
			{ type: HSL.UI.Ranges, model }
		]
	};
};


export default HSL;
