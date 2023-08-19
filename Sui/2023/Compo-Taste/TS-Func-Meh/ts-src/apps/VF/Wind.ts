import { EA, Leaf } from "../../meh/index.js";
import { Range } from "../../range.js";
import { Pitch } from "./vf-models.js";
import * as Audio from "./Audio.js";

const log = console.log;

export namespace Wind
{
	class Value
	{
		level = new Leaf.Number( 0.7 );
		pitch = new Pitch();
		width = new Leaf.Number( 0.5 );
	}

	const SUI = ( value : Value ) =>
	{
		const def : Audio.Args.Component =
		{
			output: { main: "Level" },

			constants:
			{
				pitch: { value: value.pitch, cv: v => ( v - 69 ) * 100, time: 0.004 },
				width: { value: value.width },
				level: { value: value.level, gain: 0.25 }
			},

			nodes:
			{
				"Sub": { type: SUISub },
				"Osc": { type: "Osc", params: { detune: [ "pitch" ] } },
				"Osc2": { type: "Osc", params: { detune: [ "pitch", 5 ] } },
				"Osc3": { type: "Osc", params: { detune: [ "pitch", 10 ] } },
				"Osc4": { type: "Osc", params: { detune: [ "pitch", 30 ] } },
				"Level": { type: "Gain", sources: [ "Osc", "Osc2", "Osc3", "Osc4" ], params: { gain: [ "level" ] } }
			}
		};

		return def;
	};

	const SUISub : Audio.Args.Component =
	{
		output: { main: "Osc1" },
		nodes:
		{
			Osc1: { type: "Osc" }
		}
	};

	export const UI = ( ac : AudioContext ) =>
	{
		const value = new Value();
		const sui = Audio.create( SUI( value ), ac );

		const uim =
		{
			volume: new Range.UIM( { title: "Volume", value: value.level, max: 1, step: 0.01 } ),
			pitch : new Range.UIM( { title: "Pitch",  value: value.pitch, min: 9, max: 129, step: 0.1 } ),
			width : new Range.UIM( { title: "Witdh",  value: value.width, min: 0, max: 1, step: 0.01 } ),
		};

		const header = { type: "h2", text: "Wind" };

		const pitch = PitchPane( value.pitch );

		const rc =
		[
			Range.UI( uim.volume ),
			Range.UI( uim.pitch ),
			Range.UI( uim.width ),
		];

		const ranges = { type: "div", class: "ranges", parts: rc };
		return { type: "div", class: "vf-pwa applet", parts: [ header, pitch, ranges ] };
	};
}

const PitchPane = ( value : Pitch ) : EA =>
{
	const pitch = PropPane( "Pitch", value, "" );
	const freq = PropPane( "Freq", value.freq, "Hz" );
	const key = PropPane( "Key", value.note, "" );

	return { type: "div", class: "pitch-disp", parts: [ pitch, freq, key ] };
};

const PropPane = ( title : string, value : Leaf.LoL.String | Leaf.LoL.Number, unit : Leaf.LoL.String ) : EA =>
{
	const parts =
	[
		{ type: "span", class: "title", text: title },
		" ",
		{ type: "span", class: "value", text: value },
		{ type: "span", class: "unit", text: unit }
	];

	return { type: "div", class: "prop", parts };
}
