/*
	覆号符		-	'

	分類

		構造文字

			[]		-	[]
			{}		-	()
			:		-	:
			,		-	,

		定数値

			Boolean
				true		-		't
				false		-		'f
			
			null			-		'n

		数値		-	/(-?\d+(?:\.\d)?(e-?\d+)?)/

		
		!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}

		URON文字列値

			空文字列		-	'e
			無変換		-			!$*+-;=@_~

			URON記号単変換	( 覆号符 ' を前に付加 )

				覆号符				'
				構造文字			[],():
			
			単変換	( 覆号符 ' + アルファベット1文字 )

				ASCII 改行 空白 "#%&<>`{|}

			先頭識別  ( 文字列値の先頭に、数値文字と = が来たら、覆号符 ' を前に付加 )

				数値と区別		-	'550yen	'-2.005kg
				Base64と区別		-	'=

			コード変換1		-	%25
			コード変換2		-	'xa80b
		
		Base64文字列値  ( 先頭に = を付加 )

			例					=AA9ev1==


*/

const URON = function( 前外皮, 後外皮 )
{
	const この実体 = this;

	//  インターフェース  //

	この実体.変換 = ( 値 ) =>
	{
		return 前外皮 + 変換( 値 ) + 後外皮;
	};

	この実体.復元 = ( uron, エラー値 ) =>
	{
		const json = この実体.JSONに復元( uron, 前外皮 );

		try { return JSON.parse( json ); }
		catch( ex ) { return エラー値; } 
	};

	この実体.JSONに復元 = ( uron ) =>
	{
		return JSONに復元( uron.replace( new RegExp( "^" + R( 前外皮 ) + "|\\w$", "g" ), "" ) );
	};

	この実体.モニタ = { "a": "" };

	//  設定  //

	const 覆号符 = "'";

	const 構造 = {};
	const 定値 = {};
	const 数値 = {};
	const 文字列 = {};


	//  変換  //

	const 変換 = ( 値 ) =>
	{
		if( 値 === undefined )  return "";
		if( 値 === null )  return 覆号符 + "n";
		if( 値 === true )  return 覆号符 + "t";
		if( 値 === false )  return 覆号符 + "f";

		if( 値.constructor == String )  return 文字列.変換( 値 );
		if( 値.constructor == Number )  return 値.toString();

		if( 値.constructor == Array )
		{
			const 要素連 = [];
			for( let 番号 in 値 )
			{
				const 要素 = 変換( 値[ 番号 ] );
				if( 要素 )  要素連.push( 要素 );
			}
			return "[" + 要素連.join( "," ) + "]";
		}			

		if( 値.constructor == Object )
		{
			const 要素連 = [];
			for( let 名称 in 値 )
			{
				const 要素 = 変換(  値[ 名称 ]  );
				if( 要素 )  要素連.push( 文字列.変換( 名称 )  +  ":"  +  要素  );
			}
			return "(" + 要素連.join( "," ) + ")";
		}			

		return "";
	};

	文字列.変換 = ( 値 ) =>
	{
		if( 値 == "" )  return  覆号符 + "e";

		const uron = 値.replace( 文字列.変換一致, 文字列.文字を変換 );
		//return uron;
		const base64 = "=" + Base64に変換( 値 );

		return ( uron.length <= ( base64.length * 1.0 ) ? uron : base64 );
	};

	文字列.文字を変換 = ( 全, 先頭覆号, 不変換, 単覆号, その他 ) =>
	{
		// console.log( "文字を変換", 先頭覆号 || ".", 不変換 || ".", 単覆号 || ".", その他 || "." );

		if( 不変換 )  return 不変換;
		if( 先頭覆号 )  return 覆号符 + 先頭覆号;
		if( 単覆号 )  return 覆号符 + 文字列.単覆号変換表[ 単覆号 ];
		
		const ch = その他.charCodeAt( 0 );
		return 覆号符 +
		(
			ch < 256 ?
				"X" + ch.toString( 16 ).padStart( 2, "0" ) :
				"x" + ch.toString( 16 ).padStart( 4, "0" )
		);
	};


	//  復元  //

	const JSONに復元 = ( uron ) =>
	{
		return uron.replace( 復元トークン一致, トークンをJSONに復元 );
	};

	const トークンをJSONに復元 = ( 全, 構造文字, 定値文字, 数値文字, 文字列文字 ) =>
	{
		// console.log( 構造文字||".", 定値文字||".", 数値文字||".", 文字列文字||"." );

		if( 構造文字 )  return 構造.復元表[ 構造文字 ] || 構造文字;
		if( 数値文字 )  return 数値文字;
		if( 定値文字 )  return 定値.復元表[ 定値文字 ];

		if( 文字列文字 )
		{
			return  JSON.stringify
			(
				文字列文字[ 0 ] == "=" ?

					Base64から復元( 文字列文字.slice( 1 ) )
				:
					文字列文字.replace( 文字列.文字復元一致, 文字列.覆号を復元 )
			);
		}
		
		return "";
	};

	文字列.覆号を復元 = ( 全, 単覆号, コード覆号, 先頭覆号 ) =>
	{
		// console.log( 単覆号||".", コード覆号||".", 先頭覆号||"." );

		if( 単覆号 )  return 文字列.単覆号復元表[ 単覆号 ] || "";
		if( コード覆号 )  return String.fromCharCode( ( "0x" + コード覆号.slice( 1 ) ) - 0 );
		if( 先頭覆号 )  return 先頭覆号;

		return 全;
	};
	
	//  要素定義・一致組立て  //

	const ne = ( value ) => value || "";

	const C = ( r ) => "[" + r + "]";
	const G = ( opt_ib, r, opt_ie ) => "(" + ne( opt_ib ) + r + ne( opt_ie ) + ")";
	const Gx = ( ib, r, ie ) => `(?:${ ne( ib ) }${ r }${ ne( ie ) })`;
	
	const R = ( 素文 ) => 素文.replace( /[-.*+?^=!:${}()|[\]\/\\]/g, "\\$&" );
	const CR = ( 素文, opt ) => "[" + R( 素文 ) + ne( opt ) + "]";
	const GCR = ( ib, 素文, c, ie ) => `(${ ne( ib ) }[${ R( 素文 ) + ne( c ) }]${ ne( ie ) })`;

	const R覆号符 = R( 覆号符 );
	
	// => 構造  //

	構造.使用文字群 = "[],():" ;
	構造.G復元一致 = GCR( "", 構造.使用文字群 ) ;

	構造.復元表 =
	{
		"(" : "{",
		")" : "}"
	};

	// => 定値  //

	定値.G復元一致 = R覆号符 + "([ntf])";

	定値.復元表 =
	{
		"n" : "null",
		"t" : "true",
		"f" : "false"
	};


	// => 数値  //

	数値.G復元一致 = "(-?\\d+(?:\\.\\d+)?(?:[-+]?\\d+)?)";

	// => 文字列  //

	文字列.非覆号文字連 = "!$*+-./;=?@_~" ;
	文字列.C非覆号文字 = CR( 文字列.非覆号文字連, "\\w" ) ;

	文字列.単覆号対象文字 = "\t\r\n \"#%&'+" + "<>?\\^`{|}" + 構造.使用文字群;
	文字列.単覆号対応文字 = "abcdghijkl"     + "mopqrsuvw"  + 構造.使用文字群 + "e";		//  ftnXx は不可
	文字列.単覆号変換表 = {};

	文字列.単覆号復元表 = {};

	for( let i in 文字列.単覆号対応文字 )
	{
		const 対象文字 = 文字列.単覆号対象文字[ i ];
		const 対応文字 = 文字列.単覆号対応文字[ i ];
		文字列.単覆号変換表[ 対象文字 ] = 対応文字;
		文字列.単覆号復元表[ 対応文字 ] = 対象文字;
	}


	文字列.変換一致 = new RegExp
	(
		[
			"(^[-\\d=])",
			G( "", 文字列.C非覆号文字 ),
			GCR( "", 文字列.単覆号対象文字 ),
			"(.)"
		]
		.join( "|" )
		,
		"g"
	);

	この実体.モニタ.a += ( "文字列.単覆号変換表: " +  文字列.単覆号変換表[ "," ] + "\n\n" );
	この実体.モニタ.a += ( "文字列.変換一致: " +  文字列.変換一致 + "\n\n" );

	文字列.G復元一致 = G(
		"",
		G(
			"?:",
			[
				文字列.C非覆号文字,
				R覆号符 + CR( 文字列.単覆号対応文字 ),
				R覆号符 + "(?:X[0-9a-f]{2}|x[0-9a-f]{4})",		//	コード覆号
				R覆号符 + "[-=\\d]"							//	先頭覆号
			]
			.join( "|" ),
		),
		"+"
	);

	この実体.モニタ.a += ( "文字列.G復元一致: " +  文字列.G復元一致 + "\n\n" );

	文字列.文字復元一致 = new RegExp
	(
		[
			R覆号符 + GCR( "", 文字列.単覆号対応文字 ),				//	単覆号
			R覆号符 +  "(X[0-9a-f]{2}|x[0-9a-f]{4})",				//	コード覆号
			R覆号符 +  "([-=\\d])"									//	先頭覆号
		]
		.join( "|" ),
		"g"
	);

	この実体.モニタ.a += ( "文字列.文字復元一致: " +  文字列.文字復元一致 + "\n\n" );

	//  全体  //
	
	const 復元トークン一致 = new RegExp
	(
		[
			構造.G復元一致,
			定値.G復元一致,
			数値.G復元一致,
			文字列.G復元一致
		]
		.join( "|" ),
		"g"
	);

	//  Base64  //

	const Base64に変換 = function( 文字列 )
	{
		return btoa( unescape( encodeURIComponent( 文字列 ) ) );
	};

	const Base64から復元 = function( base64 )
	{
		try{ return decodeURIComponent( escape( atob( base64 ) ) ); }
		catch( err ) { console.log( base64 ); return ""; }
	};
};

