
const URON = new function()
{
	const これ = this;
	const esc = "!";

	let ハッシュ先頭符 = "#!";
	let ハッシュ末尾符 = "_";


	const 文字列エスケープ文字表 = " \t\r\n!\",:<>\\^`{|}";
	const 文字列エスケープ覆号表 = "SCDGHIJKLMPQRUVW".toLowerCase();

	const 文字変換テーブル = {};
	const 文字復元テーブル = {};

	for( let i = 0; i < 文字列エスケープ文字表.length; i ++ )
	{
		const 覆号 = 文字列エスケープ覆号表[ i ];
		const 文字 = 文字列エスケープ文字表[ i ];
		文字変換テーブル[ 文字 ] = 覆号;
		文字復元テーブル[ 覆号 ] = 文字;
	}

	
	//   変換   //

	this.変換 = function( 値 )
	{
		const ハッシュ = 変換( 値 );
		const 末尾符 = ( ハッシュ.substr( -1 ).match( /[0-9A-Za-z]/ ) ? "" : ハッシュ末尾符 );
		return ハッシュ先頭符 + ハッシュ + 末尾符;
	};

	function 変換( 値 )
	{
		if( 値 === undefined ) return esc + "N";
		if( 値 === null ) return esc + "N";
		if( 値 === true ) return esc + "T";
		if( 値 === false ) return esc + "F";
		
		if( 値.constructor == String )
		{
			return 文字列値を変換( 値 );
		}
		
		if( 値.constructor == Number )
		{
			return 値;
		}
		
		if( 値.constructor == Array )
		{
			let rt = [];
			for( let i in 値 )
			{
				rt.push( 変換( 値[ i ] ) );
			}
			return esc + "[" + rt.join( "," ) + esc + "]";
		}
		
		if( 値.constructor == Object )
		{
			let rt = [];
			for( let fn in 値 )
			{
				rt.push
				(
					文字列値を変換( fn )
					+ ":"
					+ 変換( 値[ fn ] )
				);
			}
			return esc + "(" + rt.join( "," ) + esc + ")";
		}
		
		return esc + "n";
	};
	
	//  文字列変換  //

	//	ASCII 文字			!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~   //

	//	URONで使う文字		!"#$%&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_abcdefghijklmnopqrstuvwxyz~   //

	//		特殊記号		!,:

	//			! エスケープ		[ ] { }  true  false  null  =>  ![ !] !( !) !t ! f !n

	//		文字列で使う文字
	
	//			エスケープしない文字		#$%&'()*+-./0123456789;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_abcdefghijklmnopqrstuvwxyz~
	
	//				うち記号					#$%&'()*+-./;=?@[]_~
	
	//			エスケープされる文字

	//				URON特殊文字				!:,

	//				URLで使えない文字			改行・空白	"<>\^`{|}

	//

	//

	//	


	const 文字列値を変換 = ( 値 ) =>
	{
		if( 値 == "" )  return esc + "E";

		const uron_str = 値.replace( /[ \r\n\t !:,"<>\\^`{|}]/g, 文字変換関数 );
		
		const base64 = "=" + 文字列からBase64に変換( 値 );

		return uron_str;
		
		return ( base64.length < uron_str.length ) ? base64 : uron_str;
	};

	
	const 文字変換関数 = ( ch ) =>
	{
		const escch = 文字変換テーブル[ ch ];
		return esc + escch;
	};
	
		
	
	//   復元   //
	

	this.復元 = function( ハッシュ, エラー値 )
	{
		const json = this.JSONに復元( ハッシュ );
		return JSONから値に( json, エラー値 );
	};

	const 復元テーブル =
	{
		"(": "{",
		")": "}",
		"[": "[",
		"]": "]",
		"T": "true",
		"F": "false",
		"N": "null"
	};

	const 復元パターン = new RegExp
	(
		[
			"(?:" + esc + "([\\[\\]\\(\\)TFN]))",		//  符号  //

			"((?:-?\\d+)(?:\\.\\d+)?(?:[Ee][-+]?\\d+)?)",		//  数値  //
			
			`((?:[-#$%&'()*+./;=?@\\[\\]\\w_~]|${ esc }[${ 文字列エスケープ覆号表 }])+)`,	//  文字列  //
		]
		.join( "|" ),
		"g"
	);

	const 文字復元パターン = new RegExp
	(
		`(?:${ esc }([${ 文字列エスケープ覆号表 }])|(-?\\d))`, "g"
	);

	this.JSONに復元 = function( uron )
	{
		const a = uron.replace( /^#\?|_$/g, "" );
		return a.replace( 復元パターン, トークンをJSONに復元 );
	};

	function トークンをJSONに復元( 全, 覆号, 数値, 文字列 )
	{
		//console.log( 覆号 || "", 数値 || "", 文字列 || "" );

		if( 覆号 )  return 復元テーブル[ 覆号 ] || 覆号;

		if( 数値 )  return 数値;

		if( 文字列 )
		{
			if( 文字列[ 0 ] == "=" )
			{
				return JSON.stringify( Base64から文字列に復元( 文字列.substr( 1 ) ) );
			}

			const str = 文字列.replace( 文字復元パターン, エスケープ文字を復元 );

			return JSON.stringify( str );
		}

		return "";
	}

	const エスケープ文字を復元 = ( all, 文字, 数値文字 ) =>
	{
		if( 文字 )  return 文字復元テーブル[ 文字 ] || "";
	}

	//  //

	const 文字列からBase64に変換 = function( 文字列 )
	{
		return btoa( unescape( encodeURIComponent( 文字列 ) ) );
	};

	const Base64から文字列に復元 = function( base64 )
	{
		try{ return decodeURIComponent( escape( atob( base64 ) ) ); }
		catch( err ) { console.log( base64 ); return ""; }
	};
};
