
class Noise extends AudioWorkletProcessor
{
	process( inputs, outputs, params )
	{
		const output = outputs[ 0 ][ 0 ];

		for( let i = 0; i < output.length; i ++ )
		{
			output[ i ] = randR( 2 );
		}

		return true;
	}
}

const randR = r =>
{
	const g = 2 / ( r - 1 );
	const v = Math.floor( Math.random() * r );
	return v * g - 1;
};

const randX = x =>
{
	let r = 0;
	for( let c = 0; c < x; c ++ ) r += Math.random() * 2 - 1;
	return r / x;
}

registerProcessor( "Noise", Noise );
