//  //

import { Leaf } from "../../base/model.js";


//  //

const Range = args =>
{
	const { title, model, max = 100, step = 1, mtol, unit } = args;

	const oninput = ev => model.v = ev.target.value;

	const v_parts =
	[
		{ type: "span", text: model.adapt( mtol ) },
		{ type: "span", class: "-unit-", text: unit },
	];

	const parts =
	[
		{ type: "label", class: "-title-", text: title },
		{
			type: "input",
			class: "-range-",
			props:
			{
				type: "range",
				max, step, value: model,
				oninput
			}
		},
		{ type: "label", class: "-value-", parts: v_parts },
	];

	return { type: "div", class: "Range", parts };
};


//  //

const EG = args =>
{
	const { title, model } = args;

	const mtol = m =>
	{
		const rate = Math.pow( 10, ( m / 20 ) - 2 );
		return rate.toString().substring( 0, 5 );
	};

	const parts =
	[
		{ type: "h2", class: "-title-", text: title },
		{ type: Range, title: "Attack", model: model.attack, mtol, },
		{ type: Range, title: "Decay", model: model.decay, mtol, },
		{ type: Range, title: "Sustain", model: model.sustain, },
		{ type: Range, title: "Decay", model: model.release, mtol, },
	];

	return { type: "div", class: "module -y eg", parts };
};


//  //

const PadA = args =>
{
	const { synth, synth2 } = args;

	let gateon = false;

	const click = ev => synth.put_message( { type: ( gateon = ! gateon ) ? "test-key-on" : "test-key-off" } );

	const parts =
	[
		{ type: "button", text: "Resume", events: { click: synth.put_message( { type: "test-key-on" } ) } },
		{ type: "button", text: "A4", events: { click, } },
	];

	return { type: "div", class: "module pad-a", parts };
};


//  //

const W1 = args =>
{
	const { synth, model } = args;

	let note_stat = false;
	const click = ev => ( note_stat = ! note_stat ) ? note_on() : note_off();
	const note_on = key => synth.put_msg( { type: "note-on" } );
	const note_off = key => synth.put_msg( { type: "note-off" } );

	const parts =
	[
		{ type: "h2", class: "-title-", text: "W1" },
		
		{ type: Range, title: "Volume", model: model.volume, max: 100, unit: "%", },
		{ type: Range, title: "Osc Freq", model: model.osc_freq, max: 8000, unit: "Hz" },
		
		{ type: Range, title: "MG1 Level", model: model.mg1.level, max: 100, unit: "Hz" },
		{ type: Range, title: "MG1 Freq", model: model.mg1.freq, max: 100, step: 0.1, unit: "Hz" },
		
		{ type: Range, title: "MG2 Level", model: model.mg2.level, max: 100, unit: "Hz" },
		{ type: Range, title: "MG2 Freq", model: model.mg2.freq, max: 100, step: 0.1, unit: "Hz" },
		
		{ type: "div", class: "", parts: [ { type: "button", text: "On / Off", events: { click } } ] },
	];

	return { type: "div", class: "module -y eg", parts };
};



//  //

export const App = args =>
{
	const { synth, w1s, w1m } = args;

	const parts =
	[
		{ type: W1, synth: w1s, model: w1m },
		//{ type: EG, title: "EG1", model: model.eg1 },
		// { type: PadA, synth },
	];

	return { type: "div", class: "app modules -y", parts };
}; 

