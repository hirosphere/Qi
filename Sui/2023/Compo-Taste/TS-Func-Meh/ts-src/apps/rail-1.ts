import { DOM, ef, EA, Leaf } from "../meh/index.js";
import { Range } from "../range.js";
const log = console.log;

//  //

export namespace Rail
{
	export class Value
	{
		public readonly name  : Leaf.String ;
		public readonly speed : Leaf.Number ;
		public readonly max   : Leaf.Number ;
		public readonly bias  : Leaf.Number ;
		public readonly idle  : Leaf.Number ;

		public readonly voltage : Leaf.Number ;

		constructor( name : Leaf.LoL.String )
		{
			const rel = () => this.update();

			this.name = Leaf.String.make( name );
			this.speed = new Leaf.Number( 0, { rel } );
			this.max   = new Leaf.Number( 330, { rel } );
			this.bias  = new Leaf.Number( 1.6, { rel } );
			this.idle  = new Leaf.Number( 0.8, { rel } );

			this.voltage = new Leaf.Number( 0 );
		}

		private update()
		{
			const swing = 12 - this.bias.value;
			const voltage = swing * ( this.speed.value / this.max.value ) + this.bias.value;
			this.voltage.value = this.speed.value > 0 ? voltage : this.idle.value;
		}
	}

	export class UIM
	{
		name; speed; max; bias; idle;
		voltage;

		constructor( value : Value )
		{
			this.name = value.name;
			this.max   = new Range.UIM( { title: "Max",   unit: "km/h", min: 10, max: 700, value: value.max } );
			this.speed = new Range.UIM( { title: "Speed", unit: "km/h", min: 0, max: value.max, value: value.speed } );
			this.bias  = new Range.UIM( { title: "Bias",  unit: "V",    min: 0, max: 12, step: 0.1, value: value.bias } );
			this.idle  = new Range.UIM( { title: "Idle",  unit: "V",    min: 0, max: 12, step: 0.1, value: value.idle } );

			this.voltage = new Leaf.String( "" );
			value.voltage.createRef( () => this.voltage.value = String( Math.round( value.voltage.value * 100 ) / 100 ) + "V" );
		}
	}

	export const UI = ( uim : UIM ) : EA =>
	{
		const header = { type: "h2", text: uim.name };
		const voltage = { type: "div", text: uim.voltage };
		const speed = Range.UI( uim.speed );
		const max   = Range.UI( uim.max );
		const bias  = Range.UI( uim.bias );
		const idle  = Range.UI( uim.idle );
		const ranges = { type: "div", class: "ranges", parts: [ voltage, speed, max, bias, idle ] };

		return { type: "div", class: "applet rail", parts: [ header, ranges ] };
	}
}

