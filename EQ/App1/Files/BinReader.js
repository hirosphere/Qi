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

		let dv = DataView.prototype;
		this.Uint8 = function( caption ) {  return this.Get( 1, "uint8", caption, dv.getUint8 );  };
		this.Uint16 = function( caption ) {  return this.Get( 2, "uint16", caption, dv.getUint16 );  };
		this.Uint32 = function( caption ) {  return this.Get( 4, "uint32", caption, dv.getUint32 );  };

		this.Get = function( size, type, caption, getter )
		{
			let value = getter.call( this.view, this.pos );
			this.usem &&  this.postmonitor( type, size, caption, value );
			this.pos += size;
			return value;
		};

		this.Bcd = function( bytelen, div, caption )
		{
			var value = "bcd";
			this.usem &&  this.postmonitor( `bcd( ${ bytelen } )`, bytelen, caption, value );
			this.pos += bytelen;
			return value;
		};

		this.BcdDate = function( caption )
		{
			var value = "date";
			this.usem &&  this.postmonitor( "bcd-date", 8, caption, value );
			this.pos += 8;
			return value;
		};

		this.Skip = function( len, caption )
		{
			this.usem && this.postmonitor( "skip", len, caption, `uint8[ ${ len } ]` );
			this.pos += len;
		};

		this.postmonitor = function( type, length, caption, value )
		{
			this.monitor.push( [ caption, type, value, this.gethex( length ) ] );
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
