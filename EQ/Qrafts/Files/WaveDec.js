let EQDecoder = new function()
{
	this.Text = function( data )
	{
		;
	};

	this.Binnary = function( data )
	{
		;
	};
};


class BinReader
{
	constructor( bin )
	{
		this.view = new DataView( bin );
		this.monitor = [];
		this.pos = 0;

		this.add_monitor( "buffer length", this.view.byteLength );
		this.skip( 4, "ヘッダー" );
		this.skip( 4, "情報ブロック" );
		this.uint8( "組織ID" );
		let kik = this.uint8( "観測網ID" ) == 17;
		this.uint16( "地震計番号" );
		this.uint32( "データブロック長" );
		
		this.skip( 4, "情報データブロック1" );
		this.bcd( 4, "緯度", 100000 );
		this.bcd( 4, "経度", 100000 );
		this.bcd( 4, "標高", 100 );
		if( kik ) this.bcd( 4, "地中標高", 100 );
		this.skip( 12, "観測点に関する情報" );
		this.date( "データ開始時刻" );
		this.uint32( "計測時間" );
		this.date( "最終時刻校正時刻" );
		this.uint8( "校正手段" );
		this.uint8( "測地系" );
		this.uint16( "地震計機種コード" );
		let samplingrate = this.uint16( "サンプリングレート" );
		let ch_count = this.uint8( "成分数" );
		this.uint8( "移設フラグ" );
		//this.uint( "" );
		
		//  チャンネル情報  //

		let channels = [];

		channels[ 0 ] = this.make_channel( "NS" );
		channels[ 1 ] = this.make_channel( "EW" );
		channels[ 2 ] = this.make_channel( "UD" );

		if( ch_count == 6 )
		{
			channels[ 3 ] = this.make_channel( "NS2" );
			channels[ 4 ] = this.make_channel( "EW2" );
			channels[ 5 ] = this.make_channel( "UD2" );
		}

		//  震源情報  //

		if( this.view.getUint16( this.pos ) == 0xE020 )
		{
			is_instant = false;
			let epic = {};

			this.uint16( "情報種別", epic );
			this.uint16( "情報データサイズ", epic );
			this.date( "地震発生時刻", epic );
			this.bcd( 4, "緯度", 100000, epic );
			this.bcd( 4, "経度", 100000, epic );
			this.bcd( 4, "深さ", 1000, epic );
			this.bcd( 1, "規模", 10, epic );
			this.uint8( "測地系", epic );
			this.uint8( "震源種別", epic );
			this.uint8( "-予約-", epic );
		}
		
		while( this.pos < this.view.byteLength ) this.secblock( ch_count, channels );
	}

	make_channel( name )
	{
		let p = name + " ";
		let channel = { wk: { acc: 0, len: 0 } };

		this.uint8( p + "組織ID" );
		this.uint8( p + "観測網ID" );
		this.uint16( p + "チャンネル番号" );

		let num = this.int16( p + "スケールファクタ分子" );
		let gain = this.uint8( p + "ゲイン" );
		this.uint8( p + "単位" );
		
		let denom = this.int32( p + "スケールファクタ分母" );
		channel.offset = this.int32( p + "オフセット" );

		this.int32( p + "計測レンジ" );

		channel.scale = num / denom / gain;
		return channel;
	}

	secblock( ch_count, channels )
	{
		// this.date( "サンプリング先頭時刻" );
		// this.uint32( "フレーム時間長" );
		// let len = this.uint32( "データブロック長" );
		this.pos += 12;
		let len = this.view.getUint32( this.pos );  this.pos += 4;
		if( ( this.pos + len ) <= this.view.byteLength )
			for( var ch = 0; ch < ch_count; ch ++ )
				this.chnneldatablock( ch, channels[ ch ] );
		this.pos += len;
	}
	
	chnneldatablock( ch, info )
	{
		var pos = this.pos + 4;
		let ctt = this.view.getUint16( pos );  pos += 2;
		let type = ctt >> 12;
		let count = ( ctt & 0xFFF ) - 1;
		let output = this.channels[ ch ];
		let view = this.view;
		let offset = info.offset;
		let scale = info.scale;
		var acc = info.acc || 0;
		info.countacc = count + ( info.countacc || 0 );

		console.log( type, count, pos, view.byteLength );

		var sample = ( view.getInt32( pos ) - offset ) * scale + offset;
		output.push( sample );  pos += 4;
		acc += sample;

		switch( type )
		{
		case 0:
			for( var i = 0; i < count; i ++, pos += 1 )
			{
			}
			break;
		case 1:
			for( var i = 0; i < count; i ++, pos += 1 )
			{
				output.push( sample += ( ( view.getInt8( pos ) - offset ) * scale ) );
				acc += sample;
			}
			break;
		case 2:
			for( var i = 0; i < count; i ++, pos += 2 )
			{
				output.push( sample += ( ( view.getInt16( pos ) - offset ) * scale ) );
				acc += sample;
			}
			break;
		case 3:
			for( var i = 0; i < count; i ++, pos += 3 )
			{
				let value = view.getInt16( pos ) * 256 + view.getInt8( pos + 2 );
				output.push( sample += ( ( value - offset ) * scale ) );
				acc += sample;
			}
			break;
		case 4:
			for( var i = 0; i < count; i += 1, pos += 4 )
			{
				output.push( sample += ( ( view.getInt32( pos ) - offset ) * scale ) );
				acc += sample;
			}
			break;
		}
		info.acc = acc;
	}

	adjustoffset( channel, info )
	{
		for( var sample of channel )
		{
			sample = 2.2222;
		}
	}

	//

	//

	uint8( name )
	{
		let value = this.view.getUint8( this.pos );
		return this.push( 1, value, name, "uint8" );
	}

	uint16( name )
	{
		let value = this.view.getUint16( this.pos );
		return this.push( 2, value, name, "uint16" );
	}

	uint32( name )
	{
		let value = this.view.getUint32( this.pos );
		return this.push( 4, value, name, "uint32" );
	}

	int16( name )
	{
		let value = this.view.getInt16( this.pos );
		return this.push( 2, value, name, "int16" );
	}

	int32( name )
	{
		let value = this.view.getInt32( this.pos );
		return this.push( 4, value, name, "int32" );
	}

	bcd( len, name, div )
	{
		let value = this.bcdstr( this.pos, len ) / div;
		return this.push( len, value, name, "bcd [" + len * 2 + "]" );
	}

	date( name )
	{
		let p = this.pos;
		let date =
		[
			this.bcdstr( p + 0, 2 ), "/",
			this.bcdstr( p + 2, 1 ), "/",
			this.bcdstr( p + 3, 1 ), " ",
			this.bcdstr( p + 4, 1 ), ":",
			this.bcdstr( p + 5, 1 ), ":",
			this.bcdstr( p + 6, 1 ), "",
		].join( "" );
		let value = date;
		return this.push( 8, value, name, "bcd-date" );
	}

	skip( len, name )
	{
		this.add_monitor( name, "---", len, "skip" );
		this.pos += len;
	}

	bcdstr( pos, len )
	{
		let tbl = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "", "+", "-", "0", "" ]
		var bcd = "";
		for( var i = 0; i < len; i ++ )
		{
			let byte = this.view.getUint8( pos ++ );
			bcd += tbl[ byte >> 4 ];
			bcd += tbl[ byte & 15 ];
		}
		return bcd;
	}

	push( len, value, name, type )
	{
		this.add_monitor( name, value, len, type );
		this.pos += len;
		return value;
	}

	add_monitor( name, value, len, type )
	{
		var hex = [];
		for( var i = 0, pos = this.pos; i < len; i ++ )
		{
			hex.push( hex2( this.view.getUint8( pos ++ ) ) );
		}
		this.monitor.push( [ name, value, type, hex.join( " " ) ] );
	}
}

function hex2( v ) { return ( "0" + v.toString( 16 ) ).substr( -2 ).toUpperCase(); }
function npush( ar, n ) { ar.push( n < 8 ? n : -16 + n ); }
