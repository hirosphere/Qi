import { Leaf } from "../../../../base/model.js";
import { Range }  from "../../../../base/gui.js";


//  //

const Controls = args =>
{
	const hue = { type: Range, label: "Hue", unit: "", value: new Leaf( 0 ) };
	const sat = { type: Range, label: "Sat", unit: "%", value: new Leaf( 50 ) };
	const light = { type: Range, label: "Light", unit: "%", value: new Leaf( 50 ) };

	return { type: "div", class: "Controls", parts: [ hue, sat, light ] };
};



//  //

const HSL = args =>
{
	const display = { type: "div", class: "display" };
	const controls = Controls(  );

	return {
		type: "div", class: "Sk-HSL page",
		parts: [
			{ type: "h1", text: args.index.title },
			{ type: "div", class: "page-content col-flex", parts: [ display, controls ] }
		]
	};
};


//  //

export default HSL;
