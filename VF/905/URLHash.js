
const URLハッシュ = new function()
{
	const これ = this;
	const esc = "!";
	let ハッシュ先頭符 = "#?";
	let ハッシュ末尾符 = "_";

	// !O !o !A !a	-	オブジェクトと配列
	// : ,			-	オブジェクトと配列の区切り
	
	//	文字列 1
	//
	//		・エスケープされる文字
	//
	//			encodeURI()でエンコードされる文字と ~ : ,
	//		
	//		・エスケープをしない文字
	//		
	//			英数文字と ~ # $ & ' ( ) * + - . / ; = ? @
	//
	//
	//		ABC123_~#$&'()*+-./;=?z		->		ABC123_~#$&'()*+-./;=?z
	//		123ABC_~#$&'()*+-./;=?z		->		_123ABC_~#$&'()*+-./;=?z
	//		_ABC123_~#$&'()*+-./;=?z	->		__ABC123_~#$&'()*+-./;=?z
	//		=ABC123_~#$&'()*+-./;=?z	->		_=ABC123_~#$&'()*+-./;=?z
	//	
	//		ABC123_~#$&'()*+-./;=?		->		ABC123_~#$&'()*+-./;=?_
	//		ABC123_~#$&'()*+-./;=?_		->		ABC123_~#$&'()*+-./;=?__
	//	
	//	文字列 2  ( Base64 )
	//	
	//	

	// ~[-+0-9][-A-Za-z_0-9/]+				-	エスケープ文字列
	// ~n ~u ~t ~f	-	null , undefined , true , false
	// ~I			-	Infinity

	// 変換 //

	this.変換 = function( 値 )
	{
		const ハッシュ = 変換( 値 );
		const 末尾符 = ( ハッシュ.substr( -1 ).match( /[0-9A-Za-z]/ ) ? "" : ハッシュ末尾符 );
		return ハッシュ先頭符 + ハッシュ + 末尾符;
	};

	function 変換( 値 )
	{
		if( 値 === undefined ) return esc + "n";
		if( 値 === null ) return esc + "n";
		if( 値 === true ) return esc + "t";
		if( 値 === false ) return esc + "f";
		
		if( 値.constructor == String )
		{
			return 文字列値を変換( 値 );
		}
		
		if( 値 === Infinity ) return esc + "I";

		if( 値.constructor == Number )
		{
			return encodeURI( 値 );
		}
		
		if( 値.constructor == Array )
		{
			let rt = [];
			for( let i in 値 )
			{
				rt.push( 変換( 値[ i ] ) );
			}
			return esc + "A" + rt.join( "," ) + esc + "a";
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
			return esc + "O" + rt.join( "," ) + esc + "o";
		}
	};
	
		// 文字列変換 //
	
	const 文字列変換テーブル =
	{
		//"~": "%7e",
		"!": "%21",
		":": "%16",
		",": "%2c",
	};

	function 文字列値を変換( 値 )
	{
		if( 値 == "" )  return "$"; 

		const ue1 = encodeURI( 値 );
		const ue2 = ue1.replace( /[:,!]/g, m => 文字列変換テーブル[ m ] );
		const ue3 =
			( ue2[ 0 ].match( /[-+.\d$=]/ ) && "_" || "" )		//	-	値の先頭が数値と被る場合は、先頭に _ を付加。
			+ ue2
			+ ( ! ue2.substr( -1 ).match( /[0-9A-Za-z]/ ) && "$" || "" )	//	-	値の末尾が英数文字以外の時は、末尾に _ を付加し、ツイッターでURLとして認識させる。
		;
		const b64 = "=" + 文字列からBase64に変換( 値 );
		return ue3.length < b64.length ? ue3 : b64;
	};

	// 復元 //

	this.復元 = function( ハッシュ, エラー値 )
	{
		const json = this.JSONに復元( ハッシュ );
		return JSONから値に( json, エラー値 );
	};

	const 復元テーブル =
	{
		"O": "{",
		"o": "}",
		"A": "[",
		"a": "]",
		"t": "true",
		"f": "false",
		"n": "null",
		"u": "undefined",
		"I": "Infinity",
	};

	const 復元パターン = new RegExp
	(
		[
			"(" + esc + "(o|O|a|A|t|f|n|u|I))",

			"(([-+]?\\d+)(\\.\\d+)?([Ee][-+]?\\d+)?)",		//  -  数値
			
			"([#$&'()*+./;=?@A-Za-z_%~][-#$&'()*+./;=?@0-9A-Za-z_%~]*)",	//  - 文字列

			"(" + ハッシュ末尾符 + "$)"

		]
		.join( "|" ),
		"g"
	);

	this.JSONに復元 = function( ハッシュ )
	{
		const dec1 = ハッシュ.substr( ハッシュ先頭符.length ).replace( 復元パターン, トークンをJSONに復元 );
	
		return dec1;
	};

	function トークンをJSONに復元( 全, 全覆号, 覆号, 数値, 数値整数, 数値小数, 数値指数, 文字列, 末尾符 )
	{
		if( 覆号 )  return 復元テーブル[ 覆号 ] || 覆号;

		if( 数値 )  return 数値;

		if( 文字列 )
		{
			if( 文字列[ 0 ] == "=" )
			{
				return JSON.stringify( Base64から文字列に復元( 文字列.substr( 1 ) ) );
			}

			return JSON.stringify( decodeURI (
				文字列.substr
				(
					文字列[ 0 ] == "$" ? 1 : 0,
					文字列[ - 1 ] == "$" ? - 2 : undefined,
				) ) );
		}

		return "";
	}
};
