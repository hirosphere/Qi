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

			//  datatext から、先頭17行の各種情報 → infos, 残りの波形データ → Wave_m に。  //

			let data_m = datatext.match( /(.*\n){17}/ );
			if( ! data_m ) return;

			let infostrs = data_m[ 0 ].split( "\n" );
			let wave_m = datatext.substr( data_m[ 0 ].length ).match( /\-?\d+/g );
			if( ! wave_m )  return;

			let infos = {};
			for( var i in infostrs )
			{
				let name = infostrs[i].substr( 0, 18 ).replace( /\s+/g, "" );
				let value = infostrs[i].substr( 18 );
				console.log( [name,value].join( "=" ) );
				infos[ name ] = value;
			}
			
			//  infos 文字列から、 スケールファクター, サンプリングレート, 最高加速度 の数値を得る。  //

			let sf_m = infos[ "ScaleFactor" ].match( /(\d+)\(gal\)\/(\d+)/ );
			let sr_m = infos[ "SamplingFreq(Hz)" ].match( /(\d+)Hz/ );

			if( sf_m == null || sr_m == null )  return;

			let scalefactor = sf_m[ 1 ] / sf_m[ 2 ];
			let smprate = sr_m[ 1 ] - 0;
			
			let maxacc = infos[ "Max.Acc.(gal)" ] - 0;

			console.log( wave_m.length, scalefactor, maxacc, smprate );

			//  wave_m のストリングを数値型に変えて Float32Array の wave に格納。  //
			//   同時にwave_m の加速度計数値から、自身のオフセット除去のために平均値を得る。  //

			var sum = 0;
			let wave = new Float32Array( wave_m.length );

			for( var i = 0; i < wave_m.length; i ++ )  sum += ( wave[ i ] = wave_m[ i ] - 0 );
			let offset = sum / wave_m.length;

			console.log( offset );

			//  wave の値からオフセットを除き、スケールファクターを掛けて計器値からgalに補正。   //

			for( var i = 0; i < wave.length; i ++ )
			{
				wave[ i ] = ( wave[ i ] - offset ) * scalefactor;
			}

			//console.log( wave.join( "\n" ) );

			//  各価をフィールドに格納。  //

			this.MaxAcc = maxacc;
			this.SampleRate = smprate;
			this.Wave = wave;
			this.Completed = true;
		};
	}
);
