
const URLハッシュ = new function()
{
	const これ = this;

	これ.値を変換 = function( 値 )
	{
		if( 値 === undefined )  return "?"
		if( 値 === null )  return "~"
		if( 値 === true )  return "*"
		if( 値 === false )  return "|"

		if( 値.constructor == Number )  return "" + 値;

		if( 値.constructor == Array )
		{
			const values = [];
			for( let item of 値 )  values.push( これ.値を変換( item ) );
			return "[" + values.join( "," ) + "]"
		}

		if( 値.constructor == Object )
		{
			const values = [];
			for( let fn in 値 )  values.push( 文字列からハッシュへ( fn ) + ":" + これ.値を変換( 値[ fn ] ) );
			return "{" + values.join( "," ) + "}"
		}
	};

	function 文字列からハッシュへ( 文字列 )
	{
		return encodeURI( 文字列 );
	}

	これ.値を得る = function( URLハッシュ )
	{
		const root = new di_root();
		let curr = root;

		URLハッシュ.replace( regexp, conv );

		function conv( all, number, d1, d2, enc_string, field_sep, coll )
		{
			console.log( number, enc_string, field_sep, coll );

			const string = enc_string && decodeURI( enc_string ) || "";

			if( number )  curr.set_value( number - 0 );

			if( coll == "[" )  curr = new di_arr( curr );
			if( coll == "]" )  curr = curr.com || root;

			if( coll == "{" )  curr = new di_obj( curr );
			if( coll == "}" )  curr = curr.com || root;

			if( field_sep )  curr.fieldname = string;
		}
	
		return root.value;
	};

	function di_root()
	{
		this.set_value = function( value ) { this.value = value; }
	}

	function di_arr( com )
	{
		this.com = com;
		this.value = [];
		com.set_value( this.value );
		this.set_value = function( value ) { this.value.push( value ) };
	}

	function di_obj( com )
	{
		this.com = com;
		this.value = {};
		this.fieldname = "";
		com.set_value( this.value );
		this.set_value = function( value ) { this.value[ this.fieldname ] = value };
	}
	
	const regexp = new RegExp
	(
		[
			/* 数値 */		"([-+]?\\d+(\\.\\d+)?([Ee][-+]?\\d+)?)",
			
			/* 文字列, フィールド名 */	"([A-Za-z0-9]+)(:)?",

			/* 記号 */	"(" + [ "\\[", "\\]", "\\{", "\\}" ].join( "|" ) + ")",

		].join( "|" ),
		"g"
	);

	console.log( regexp );
	
};

