import { useState } from "react";
import { Leaf, Rel } from "../Leaf";

export const CompoA = ( { model } ) =>
{
	const [ count ] = model.count.shot = useState( model.count.value );

	return (
		<li>
			<span onMouseEnter ={ () => model.count.value ++ } >{ model.name }で{ count }つ,</span>
		</li>
	)
};

//

export const Range = ( { title, model, unit, max } ) =>
{
	model.shot = useState( model.value );

	return (
		<div className="Range">
			<label className="title">{ title }</label>
			<input type="range" max={ max } value={ model.value } onInput={ ev => model.value = ev.target.value } />
			<span className="value">{ model.value }</span>
			<span className="unit">{ unit }</span>
		</div>
	);
};


export const HSLControl = ( { model } ) =>
{
	return (
		<div className="HSLControl">
			<Range title="Hue" model={ model.hue } unit="°" max="360"/>
			<Range title="Sat" model={ model.sat } unit="%"/>
			<Range title="Light" model={ model.light } unit="%"/>
		</div>
	);
};

export const HSLView = ( { model } ) =>
{
	const [ color ] = model.css.shot = useState( model.css.value );
	return <div className="HSLView" style={ { background: color } } >{ model.css.value }</div>
};


export const HSLModel = class
{
	constructor( args )
	{
		const hue = this.hue = new Leaf( { value: args.hue } );
		const sat =  this.sat = new Leaf( { value: args.sat } );
		const light = this.light = new Leaf( { value: args.light } );

		this.css = new Rel
		(
			{
				src: { hue, sat, light },
				calc: ( { hue, sat, light } ) =>
				{
					return `hsl( ${ hue }, ${ sat }%, ${ light }% )`
				},
			}
		);
	}
};

