let EQWave = {};

EQWave.WaveUnit = class_def
(
	null,
	function()
	{
		this.Initiate = function()
		{
		};

		this.LoadDataText = function( filepath )
		{
			this.SetDataText( q.get( filepath ) );
		};

		this.SetDataText = function( datatext )
		{
			this.Completed = false;

			let m1 = datatext.match( /(.*\n){17}/ );
			if( ! m1 ) return;

			let infostr = m1[ 0 ].split( "\n" );
			let wavematch = datatext.substr( m1[ 0 ].length ).match( /\-?\d+/g );
			if( ! wavematch )  return;

			let info = {};
			for( var i in infostr )
			{
				let fn = infostr[i].substr( 0, 18 ).replace( /\s+/g, "" );
				let value = infostr[i].substr( 18 );
				console.log( [fn,value].join( "=" ) );
				info[ fn ] = value;
			}
			
			let sf_match = info[ "ScaleFactor" ].match( /(\d+)\(gal\)\/(\d+)/ );
			let sr_match = info[ "SamplingFreq(Hz)" ].match( /(\d+)Hz/ );

			if( sf_match == null || sr_match == null )  return;

			let scalefactor = sf_match[ 1 ] / sf_match[ 2 ];
			let smprate = sr_match[ 1 ] - 0;
			
			let maxacc = info[ "Max.Acc.(gal)" ] - 0;

			console.log( wavematch.length, scalefactor, maxacc, smprate );

			var sum = 0;
			let wave = new Float32Array( wavematch.length );

			for( var i = 0; i < wavematch.length; i ++ )  sum += ( wave[ i ] = wavematch[ i ] - 0 );
			let offset = sum / wavematch.length;

			console.log( offset );

			for( var i = 0; i < wave.length; i ++ )
			{
				wave[ i ] = ( wave[ i ] - offset ) * scalefactor;
			}

			//console.log( wave.join( "\n" ) );


			this.MaxAcc = maxacc;
			this.SampleRate = smprate;
			this.Wave = wave;
			this.Completed = true;
		};
	}
);
