import { useState, useEffect } from "react";
import { Leaf, Rel } from "../Leaf";

//  //

export const Tokyo = class
{
	constructor( { title, points } )
	{
		this.title = title;
		points.forEach( point => this.addPoint( point ) );
	}

	addPoint( name )
	{
		this.points.push( { name, count: Leaf.new( 0, this.total ) } );
	}

	get_total()
	{
		let acc = 0;
		this.points.forEach( item => acc += item.count.value );
		return acc;
	}

	points = [];
	total = new Rel( { calc: () => this.get_total() } );
};

//  //

export const Point = ( { model } ) =>
{
	const [ count, setcount ] = useState( model.count.value );

	useEffect( () => { model.count.view = setcount; }, [] );

	return (
		<li>
			<span
				onTouchStart = { ev => { ev.preventDefault(); } }
				onMouseMove = { ev => model.count.value += ev.movementX }
				onTouchMove = { ev => { ev.preventDefault(); } }
				onClick = { ev => model.count.value = 100 }
			>{ model.name }で{ count }つ,</span>
		</li>
	)
};

//  //

export const TokyoView = ( { model } ) =>
{
	const [ total, settotal ] = useState( model.total.value );

	useEffect( () => { model.total.view = settotal; }, [] );

	return (
		<div>
			<h2>{ model.title }で{ total }つ。</h2>
			<ul>{ model.points.map( point => <Point model={ point } /> ) }</ul>
		</div>
	)
};


//

export const Range = ( { title, model, unit, max } ) =>
{
	const [ value, setvalue ] = useState( model.value );

	useEffect( () => { model.view = setvalue }, [] );

	return (
		<div className="Range">
			<label className="title">{ title }</label>
			<input type="range" max={ max } value={ value } onInput={ ev => model.value = ev.target.value - 0 } />
			<span className="value">{ value }</span>
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
	const [ color, setcolor ] = useState( model.css.value );
	useEffect( () => { model.css.view = setcolor }, [] );
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

