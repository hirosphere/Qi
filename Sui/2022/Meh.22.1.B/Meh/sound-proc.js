
class Noise extends AudioWorkletProcessor
{
	process( inputs, outputs, params )
	{
		const output = outputs[ 0 ][ 0 ];

		for( let i = 0; i < output.length; i ++ )
		{
			output[ i ] = Math.random() * 2 - 1;
		}

		return true;
	}
}

registerProcessor( "Noise", Noise );
