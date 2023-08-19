import { Leaf } from "../../meh/index.js";

export class Pitch extends Leaf.Number
{
	freq; note;

	constructor()
	{
		const rel = () => this.update();

		super( 69, { rel } );
		this.freq = new Leaf.String( "" );
		this.note = new Leaf.String( "A4" );

		rel();
	}

	update()
	{
		const { freq, keyname } = ptol( this.value, 440 );

		this.freq.value = r( freq );
		this.note.value = keyname; 
	}
}

const ptol = ( pitch : number, tune = 440 ) =>
{
	const key = Math.round( pitch );
	const oct = Math.floor( key / 12 ) - 1;
	const frac = pitch - key;
	const kni = ( key >= 0 ? key % 12 : 12 + ( key % 12 ) );
	const keyname = [ "C", "C#", "D", "D#",  "E", "F", "F#", "G",  "G#", "A", "A#", "B",  "C" ] [ kni ] + oct;
	
	const freq = tune * Math.pow( 2, ( pitch - 69 ) / 12 );

	return { keyname, oct, frac, freq };
};

const r = ( v : number, s = 1 ) => String( Math.round( v * s ) / s );
