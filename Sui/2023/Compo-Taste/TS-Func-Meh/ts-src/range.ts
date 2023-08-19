import { DOM, ef, EA, Leaf } from "./meh/index.js";
const log = console.log;



//  //

class UIM
{
	title ? : Leaf.LoL.String ;
	value ? : Leaf.LoL.Number ;
	unit ? : Leaf.LoL.String;
	min ? : Leaf.LoL.Number ;
	max ? : Leaf.LoL.Number ;
	step ? : Leaf.LoL.Number ;
	toV ? : ( value : number ) => string ;

	constructor( initv : UIM )
	{
		this.title = Leaf.String.make( initv.title ?? "" );
		this.value = Leaf.Number.make( initv.value ?? 0 );
		this.unit = Leaf.String.make( initv.unit ?? "" );
		this.min = Leaf.Number.make( initv.min ?? 0 );
		this.max = Leaf.Number.make( initv.max ?? 100 );
		this.step = Leaf.Number.make( initv.step ?? 1 );
	}
}

const UI = ( model : UIM ) : EA =>
{
	model = new UIM( model );

	const oninput = ( ev : Event ) =>
	{
		if( ev.target instanceof HTMLInputElement ) Leaf.set( model.value, Number( ev.target.value ) );
	};

	const title = { type: "span", class: "-title", text: model.title };
	const input =
	{
		type: "input", class: "-input",
		attrs:
		{
			type: "range", value: model.value ?? 0,
			min: model.min,
			max: model.max,
			step: model.step
		},
		props:
		{
			value: model.value
		},
		acts: { input: oninput }
	};
	const value = { type: "span", class: "-value", text: model.value };
	const unit = { type: "span", class: "-unit", text: model.unit };
	const vu = { type: "span", class: "-vu", parts: [ value, unit ] };

	return { type: "div", class: "range", parts: [ title, input, vu ] };
}	

export const Range = { UIM, UI };

