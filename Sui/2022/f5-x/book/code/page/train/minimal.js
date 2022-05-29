import { Leaf } from "../../../../base/model.js";
import { Range } from "../../ui.js";


//  //

export const Minimal = args =>
{
	const model =
	{
		idle  : new Leaf( 0.8 ),
		bias  : new Leaf( 1.2 ),
		max   : new Leaf( 240 ),
		speed : new Leaf( 0 ),
	};

	const parts =
	[
		{ type: Range, title: "速度", value: model.speed, max: model.max, step: 1, unit: "km/h", },
		{ type: Range, title: "最高速度", value: model.max, max: 1000, step: 1, unit: "km/h", },
		{ type: Range, title: "基底電圧", value: model.bias, max: 12, step: 0.05, frac: 2, unit: "V", },
		{ type: Range, title: "待機電圧", value: model.idle, max: 12, step: 0.05, frac: 2, unit: "V", },
	];

	return { type: "div", class: "Minimal", parts };
};


