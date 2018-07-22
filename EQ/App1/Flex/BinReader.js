let BinReader = class_def
(
	null,
	function()
	{
		this.Initiate = function( buffer, usemonitor )
		{
			this.monitor = [];
			this.view = new DataView( buffer );
			this.usem = usemonitor;
			this.pos = 0;
		};

		this.IsEnd = function() { return this.pos >= this.view.byteLength; };

		let dv = DataView.prototype;
		this.Uint8 = function( caption ) {  return this.Get( 1, "uint8", caption, dv.getUint8 );  };
		this.Uint16 = function( caption ) {  return this.Get( 2, "uint16", caption, dv.getUint16 );  };
		this.Uint32 = function( caption ) {  return this.Get( 4, "uint32", caption, dv.getUint32 );  };
		
		this.Int8 = function( caption ) {  return this.Get( 1, "int8", caption, dv.getInt8 );  };
		this.Int16 = function( caption ) {  return this.Get( 2, "int16", caption, dv.getInt16 );  };
		this.Int32 = function( caption ) {  return this.Get( 4, "int32", caption, dv.getInt32 );  };

		this.Get = function( size, type, caption, getter )
		{
			let value = getter.call( this.view, this.pos );
			this.usem &&  this.postmonitor( type, size, caption, value );
			this.pos += size;
			return value;
		};

		this.Bcd = function( bytelen, div, caption )
		{
			let bcd = this.bcd_str( bytelen );
			let value = bcd.replace( /^([+-])?0+/, "$1" ) / div;
			
			this.usem &&  this.postmonitor( `bcd( ${ bytelen } )`, bytelen, caption, value );
			this.pos += bytelen;
			return value;
		};

		let bcdtbl = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "+", "-", "0", "" ];

		this.BcdDate = function( caption )
		{
			let bcd = this.bcd_str( 8 );
			let date = new Date( bcd.substr( 0, 4 ), bcd.substr( 4, 2 ) - 1, bcd.substr( 6, 2 ), bcd.substr( 8, 2 ), bcd.substr( 10, 2 ), bcd.substr( 12, 2 ), bcd.substr( 14, 2 ) );
			let value = date.toLocaleString();
			this.usem &&  this.postmonitor( "bcd-date", 8, caption, value );
			this.pos += 8;
			return value;
		};

		this.bcd_str = function( bytelen )
		{
			var bcd = "";

			for( var i = 0; i < bytelen; i ++ )
			{
				let byte = this.view.getUint8( this.pos + i );
				bcd += bcdtbl[ byte >> 4 ] + bcdtbl[ byte & 15 ];
			}
			return bcd;
		};

		this.Skip = function( len, caption )
		{
			this.usem && this.postmonitor( "skip", len, caption, `( ${ len } )` );
			this.pos += len;
		};

		this.postmonitor = function( type, length, caption, value )
		{
			this.monitor.push( [ caption, type, value, this.gethex( length ), this.pos ] );
		};

		let htbl = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ];

		this.gethex = function( length )
		{
			let rt = [];

			for( var pos = this.pos, i = 0; i < length; pos ++, i ++ )
			{
				let value = this.view.getUint8( pos );
				rt[ i ] = htbl[ value >> 4 ] + htbl[ value & 15 ];
			}

			return rt.join( " " );
		}

	}
);
