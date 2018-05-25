
let EQWave = class_def
(
	null,
	function( base, bc, ctor )
	{
		// static //

		let Wavesets = {};

		ctor.Get = function( filepath, surf, callback )
		{
			var wset = Wavesets[ filepath ];
			if( wset )  callback( wset[ surf ? 0 : 1 ] );

			EQFS.GetBinaryFile( filepath, on_bin_load );

			function on_bin_load( data )
			{
				let dec = EQDec.Bin( data, true );

				let wset = Wavesets[ filepath ] =
				[
					new EQWave( dec, true ),
					new EQWave( dec, false )
				];

				callback( wset[ surf ? 0 : 1 ] );
			}
		};

		//    //

		this.Initiate = function( dec, surf )
		{
			this.Monitor = dec.monitor;
		};
	}
);

let EQDec = new function()
{
	//  バイナリデコーダー  //
	//  http://www.kyoshin.bosai.go.jp/kyoshin/man/knetbinary.html  //

	this.Bin = function( data )
	{
		let rd = new BinReader( data, true );

		//  ヘッダー  //
		
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

		rd.BcdDate( "最終時刻校正時刻" );
		rd.Uint8( "校正手段" );
		rd.Uint8( "測地系" );
		rd.Uint16( "地震計機種コード" );
			let samplingrate =
		rd.Uint16( "サンプリングレート" );
			let ch_count =
		rd.Uint8( "成分数" );
		rd.Uint8( "移設フラグ" );

		let wave_1 = new Wave( rd );
		let wave_2 = ( isKik ? new Wave( rd ) : null );

		let rt =
		{
			monitor: rd.monitor
		};

		return rt;
	};

	function Wave( rd )
	{
		this.Info = {};
		this.Info.NS = bin_Channel_Info( "NS", rd );
		this.Info.EW = bin_Channel_Info( "EW", rd );
		this.Info.UD = bin_Channel_Info( "UD", rd );
	}

	function bin_Channel_Info( ch_name, rd )
	{
		let p = ch_name + " ";

		rd.Uint8( p + "組織ID" );
		rd.Uint8( p + "観測網ID" );
		rd.Uint16( p + "チャンネル番号" );

		let num = rd.Int16( p + "スケールファクタ分子" );
		let gain = rd.Uint8( p + "ゲイン" );
		rd.Uint8( p + "単位" );
		
		let denom = rd.Int32( p + "スケールファクタ分母" );

		let channel = {};
		channel.offset = rd.Int32( p + "オフセット" );

		rd.Int32( p + "計測レンジ" );

		channel.scale = num / denom / gain;
		return channel;
	}
	
};
