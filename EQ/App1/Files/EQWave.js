
let EQWave = class_def
(
	null,
	function( base, ctor )
	{
		// static //

		let Wavesets = {};

		ctor.Get = function( filepath, surf, callback )
		{
			var wset = Wavesets[ filepath ];
			if( wset )
			{
				callback( wset[ surf ? 0 : 1 ] );
				return;
			}

			EQFS.GetBinaryFile( filepath, on_bin_load );

			function on_bin_load( data )
			{
				let dec = EQDec.Bin( data, true );

				let wset = Wavesets[ filepath ] =
				[
					new EQWave( dec, true ),
					dec.IsKiK ? new EQWave( dec, false ) : null
				];

				callback( wset[ surf ? 0 : 1 ] );
			}
		};

		//    //

		this.Initiate = function( dec, surf )
		{
			this.IsKiK = dec.IsKiK;
			this.Channels = dec.Channels;
			this.SamplingRate = dec.SamplingRate;
			this.SampleTime = dec.SampleTime / 10;

			let upper = dec.IsKiK && surf;
			this.NS = dec.Channels[ upper ? 3 : 0 ];
			this.EW = dec.Channels[ upper ? 4 : 1 ];
			this.UD = dec.Channels[ upper ? 5 : 2 ];

			this.MaxAcc = Math.max( this.NS.MaxAcc, Math.max( this.EW.MaxAcc, this.UD.MaxAcc ) );

			this.Monitor = dec.monitor;
			this.ChannelMonitor = dec.Channels[ 0 ].Monitor;
		};

		this.GetInfo = function()
		{
			return `MaxAcc: ${ this.MaxAcc }\n  NS ${ this.NS.GetInfo() }\n  EW ${ this.EW.GetInfo() }\n  UD ${ this.UD.GetInfo() }`;
		};
	}
);

let EQDec = new function()
{
	//  バイナリデコーダー  //
	//  http://www.kyoshin.bosai.go.jp/kyoshin/man/knetbinary.html  //

	this.Bin = function( data, usemonitor )
	{
		let rd = new BinReader( data, usemonitor );

		//  情報ブロックヘッダ  //
		
		rd.Skip( 8, "ヘッダ・情報ブロック" );
		rd.Uint8( "組織ID" );
			let isKik = 17 ==
		rd.Uint8( "観測網ID" );
		rd.Uint16( "地震計番号" );
		rd.Uint32( "データブロック長" );

		//  情報データブロック 1  //
		
		rd.Skip( 4, "情報データブロック1" );

		    //  観測点に関する情報  //

		rd.Bcd( 4, 100000, "緯度" );
		rd.Bcd( 4, 100000, "経度" );
		rd.Bcd( 4, 100, "標高" );
		if( isKik ) rd.Bcd( 4, 100, "地中標高" );

		rd.Skip( 12, "観測点に関する情報" );
		rd.BcdDate( "データ開始時刻" );
		let sampletime = rd.Uint32( "計測時間" );

		rd.BcdDate( "最終時刻校正時刻" );
		rd.Uint8( "校正手段" );
		rd.Uint8( "測地系" );
		rd.Uint16( "地震計機種コード" );

		let samplingrate = rd.Uint16( "サンプリングレート" );
		let ch_count = rd.Uint8( "成分数" );
		let samplecount = sampletime * samplingrate / 10;
		
		rd.Uint8( "移設フラグ" );

		    //  各チャンネル成分に関する情報  //

		let channel_list = new Bin_Channel( [], ch_count, 0, samplecount, rd );
		
		// let wave_1 = bin_Wave_Info( rd, isKik, "1" );
		// let wave_2 = ( isKik ? bin_Wave_Info( rd, isKik, "2" ) : null );

		//  情報データブロック 2  //

		let isInstant = rd.view.getUint16( rd.pos ) != 0xE020;
		if( ! isInstant )
		{
			rd.Uint16( "情報種別" );
			rd.Uint16( "情報データサイズ" );
			rd.BcdDate( "地震発生時刻" );
			rd.Bcd( 4, 100000, "緯度" );
			rd.Bcd( 4, 100000, "経度" );
			rd.Bcd( 4, 1000, "深さ" );
			rd.Bcd( 1, 10, "規模" );
			rd.Uint8( "測地系" );
			rd.Uint8( "震源種別" );
			rd.Uint8( "-予約-" );
		}

		// 秒ブロック... ( 波形データ本体 ) //

		channel_list.ReadSecBlock();
		
		//  //
		
		let rt =
		{
			IsKiK: isKik,
			SamplingRate: samplingrate,
			SampleTime: sampletime,
			Channels: channel_list.Channels,
			monitor: rd.monitor
		};

		return rt;
	};

	let Bin_Channel = class_def
	(
		null,
		function()
		{
			this.Initiate = function( channels, ch_count, index, samplecount, rd, mon )
			{
				this.Monitor = mon || [];
				this.Samples = new Float32Array( samplecount );
				this.index = index;
				this.rd = rd;

				this.work = { pos: 0, acc: 0, max: 0, min: 0 };

				let p = this.indexp = `ch ${ index + 1 }  `;
		
				rd.Uint8( p + "組織ID" );
				rd.Uint8( p + "観測網ID" );
				rd.Uint16( p + "チャンネル番号" );
		
				let num = rd.Int16( p + "スケールファクタ分子" );
				let gain = rd.Uint8( p + "ゲイン" );
				rd.Uint8( p + "単位" );
				
				let denom = rd.Int32( p + "スケールファクタ分母" );
				let offset = rd.Int32( p + "オフセット" );
				rd.Int32( p + "計測レンジ" );
				let scale = num / denom / gain;

				channels[ index ] = this;
				this.Channels = channels;

				//if( index == 0 ) this.log( "Ch", "Scale", "num, denom, gain", "offset" );
				//this.log( `Channel ${ index }`, scale, [ num, denom, gain ].join( ", " ), offset );
				
				this.Header =
				{
					Scale: scale, Denom: denom, Nom: num, Gain: gain, Offset: offset
				};

				this.SampleCount = samplecount;
				this.Offset = 0;
				this.Scale = scale;

				if( ( index + 1 ) < ch_count )
				{
					this.Next = new Bin_Channel( channels, ch_count, index + 1, samplecount, rd, this.Monitor );
				}
			};

			this.log = function( a, b, c, d, e ) { this.Monitor.push( [ a, b, c, d, e ] ); };

			this.GetInfo = function()
			{
				let o = this.Offset;
				return `MaxAcc: ${ this.MaxAcc } Offset: ${ o } max: ${ this.work.max - o } min: ${ this.work.min - o }`;
			}
					
			this.GetSample = function( index )
			{
				return this.Samples[ index ];
			};

			this.ReadSecBlock = function()
			{
				var bctr = 0;
				while( ! this.rd.IsEnd() )
				{
					this.rd.BcdDate( `秒ブロック先頭時刻 ${ bctr }` );
					this.rd.Uint32( "フレーム時間長" );
					let blocksize = this.rd.Uint32( "チャンネルデータサイズ" );
					let nextpos = this.rd.pos + blocksize;

					this.ReadChannelSec( this.rd.view, this.rd.pos, bctr );
		
					this.rd.pos = nextpos;
					bctr ++;
				}

				this.Complete();
			};

			this.Complete = function()
			{
				let offset = this.Offset = this.work.acc / this.SampleCount;

				let smpls = this.Samples;
				for( var i = 0, maxacc = 0; i < smpls.length; i ++ )  maxacc = maxabs( smpls[ i ] -= offset, maxacc );

				this.MaxAcc = maxacc;
				this.Next && this.Next.Complete();
			};

			function maxabs( value, max ) { return Math.max( max, Math.abs( value ) ); }

			this.ReadChannelSec = function( view, pos, blockn )
			{
				if( pos >= view.byteLength )  return;

				let sizect = view.getUint16( pos + 4 );
				let size = sizect >> 12;
				let count = ( sizect & 0xfff ) - 1;
				let sample = view.getInt32( pos + 6 );

				this.AddSample( sample );
				//this.AddSample( 0 );

				this.rd.pos = pos;
				this.rd.Skip( 4,  this.indexp + "---" );
				this.rd.Uint16( this.indexp + "SizeCount" );
				this.rd.Int32( this.indexp + "Sample" );

				pos += 10;

				let p = this.indexp;
				
				switch( size + 0 )
				{
					case 0:  pos = this.ReadSample_4( view, pos, sample, count, this.Samples, this.work );  break;
					case 1:  pos = this.ReadSample_8( view, pos, sample, count, this.Samples, this.work );  break;
					case 2:  pos = this.ReadSample_16( view, pos, sample, count, this.Samples, this.work );  break;
					case 3:  pos = this.ReadSample_24( view, pos, sample, count, this.Samples, this.work );  break;
					case 4:  pos = this.ReadSample_32( view, pos, sample, count, this.Samples, this.work );  break;
				}

				this.Next && this.Next.ReadChannelSec( view, pos, blockn );
			};

			this.ReadSample_4 = function( view, pos, sample, count )
			{
				while( count > 0 )
				{
					let value = view.getUint8( pos );
					pos += 1;
					sample += utoi( value >> 4 );
					this.AddSample( sample );
					count --;
					if( count > 0 )
					{
						sample += utoi( value & 15 );
						this.AddSample( sample );
					}
					count --;
				}
				return pos;
			};

				function utoi( u4 ) { return 0 ? u4 : 0 }

			this.ReadSample_8 = function( view, pos, sample, count )
			{
				while( count -- )
				{
					sample += view.getInt8( pos );
					pos += 1;
					this.AddSample( sample );
				}
				return pos;
			};

			this.ReadSample_16 = function( view, pos, sample, count )
			{
				while( count -- )
				{
					sample += view.getInt16( pos );
					pos += 2;
					this.AddSample( sample );
				}
				return pos;
			};

			this.ReadSample_24 = function( view, pos, sample, count )
			{
				while( count -- )
				{
					sample += view.getInt32( pos ) >> 8;
					pos += 3;
					this.AddSample( sample );
				}
				return pos;
			};

			this.ReadSample_32 = function( view, pos, sample, count )
			{
				while( count -- )
				{
					sample += view.getInt32( pos );
					pos += 4;
					this.AddSample( sample );
				}
				return pos;
			};

			this.AddSample = function( value )
			{
				let sample = this.Samples[ this.work.pos ++ ] = this.Scale * value ;
				this.work.acc += sample ;
				this.work.max = Math.max( this.work.max, sample ) ;
				this.work.min = Math.min( this.work.min, sample ) ;
			};
		}
	);
};
