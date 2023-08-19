import { DOM, ef, EA, Leaf } from "./meh/index.js";
import { Range } from "./range.js";
const log = console.log;

//  //

/*

vdef HSL
{
	hue : number ;
	sat : number ;
	lig : number ;

	@ rel css : string ;

	@ update( { hue, sat, lig } )
	{
		return { css: `hsl( ${ hue }, ${ sat * 100 }%, ${ lig * 100 }% )` }
	}

	@ def : {  hue: 180, sat: 0.7. lig: 0.7 }
}


*/

class Value
{
	hue ? : Leaf.LoL.Number;
	sat ? : Leaf.LoL.Number;
	lig ? : Leaf.LoL.Number;

	constructor( iv : Value )
	{
		const rel = () => this.update();

		this.hue = Leaf.Number.make( iv.hue ?? 195 );
		this.sat = Leaf.Number.make( iv.sat ?? 0.7 );
		this.lig = Leaf.Number.make( iv.lig ?? 0.7 );
	}

	private update()
	{
		;
	}
}

export const HSL = { Value };
