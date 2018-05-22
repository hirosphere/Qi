
let EQWave = class_def
(
	null,
	function( base, bc, ctor )
	{
		this.Initiate = function()
		{
			;
		};

		this.Load = function( filepath, callback )
		{
			EQFS.GetBinaryFile( filepath, onload );
			let self = this;
			function onload( data )
			{
				self.SetBinary( data );
				callback();
			}
		};

		this.SetBinary = function( data, surf )
		{
			let rd = new BinReader( data, true );

			rd.Skip( 8, "ヘッダー・情報ブロック" );
			rd.Uint8( "組織ID" );
			let isKik = 17 ==
			rd.Uint8( "観測網ID" );
			rd.Uint16( "地震計番号" );
			rd.Uint32( "データブロック長" );

			
			rd.Skip( 4, "情報データブロック1" );
			rd.Bcd( 4, 100000, "緯度" );
			rd.Bcd( 4, 100000, "経度" );
			rd.Bcd( 4, 100, "標高" );
			if( isKik ) rd.Bcd( 4, 100, "地中標高" );
			rd.Skip( 12, "観測点に関する情報" );
			rd.BcdDate( "データ開始時刻" );
			rd.Uint32( "計測時間" );

			this.Monitor = rd.monitor.join( "\n" );
		};

		//  //

		let Waves = {};

		ctor.Get = function( filepath, callback )
		{
			var wave = Waves[ filepath ];
			if( wave )  callback( wave );

			wave = new ctor();
			wave.Load( filepath, onload );

			function onload()
			{
				Waves[ filepath ] = wave;
				callback( wave );
			}
		};

	}
);

