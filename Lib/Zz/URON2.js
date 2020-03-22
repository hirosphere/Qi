
const URON = new function()
{
	//  公開  //

	const この実体 = this;

	この実体.変換 = ( 値 ) =>
	{
		return 変換.外皮を付加
		(
			変換.実行( 値 )
		);
	};
	
	この実体.ハッシュからJSONに復元 = ( ハッシュURON ) =>
	{
		return 復元.実行
		(
			ハッシュURON.replace( 復元.ハッシュ外皮除去パターン, "" )
		);
	};

	この実体.JSONに復元 = ( uron ) =>
	{
		return 復元.実行( uron );
	};

	この実体.ハッシュ外皮を除去 = ( uron ) =>
	{
		return uron.replace( 復元.ハッシュ外皮除去パターン, "" );
	};


	// 	 仕様   //

		//		ハッシュ外皮	#? z

		//			URLとして通用させるために、末尾に必ず[0-9A-Za-z_]のいずれかの文字を1字付加する。

		//	
		//		構造文字		[]{}:,		=>		[]():,
		//		
		//		ブーリアン, ヌル		'T  'F  'N
		//		
		//		数値
		//		
		//		文字列の変換

		//
		//			そのまま使用	#$%&*+-./0123456789;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~

		//			覆号符			'  =>  ''
		//			構造文字		[]():,	=>		'[']'(')':',
		//			単覆号化		ASCIIスペース タブ 改行 "<>\\^`{|}		=>		'A  'F	'[ABCDGHIJKLMOS]
		//			空文字			'E
		//			コード覆号化					'X07  'xc21a
		//			先頭文字		-=0-9		=>		'-  '=  '9
		//				( 数値/Base64と区別 )
		
		//			Base64
		//				( 変換値の先頭に = を付加して区別 )
			
			

	//  設定  //

	const 覆号符 = "'";
	const 外皮先頭 = "#?";
	const 外皮末尾 = "z";

	const 変換 = {};
	const 復元 = {};

	//  文字列値処理パターン作成  //

	//	 ASCII文字 = "\t\n\r !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

	{
		const R = ( 素文 ) => 素文.replace( /[.*+?^=!:${}()|[\]\/\\]/g, "\\$&" );
		const CR = ( 素文 ) => "[" + R( 素文 ) + "]";

		const r覆号符 = R( 覆号符 );
		
		const 単覆号文字表 =   "'[]():,"   +   "\t\n\r\"<>"  +   "\\^`{|}"  +  " ";
		const 単覆号対応表 = ( "'[]():,"   +   "ABCDGH"      +   "IJKLMO"   +  "SE" ).toLowerCase();

		const rc非覆号文字 = "[" + R( "!#$%&*+-./;=?@_~" ) + "0-9A-Za-z" + "]";
		const rc単覆号文字 = CR( 単覆号文字表 );

		変換.文字列パターン = new RegExp
		(
			"(^[-\\=\\d])|" +		//  値先頭の = と数値 //
			"(" + rc単覆号文字 + ")|"  +		//  単覆号文字  //
			"(" + rc非覆号文字 + ")|"  +		//  非覆号文字  //
			"(.)" ,		//  その他 文字コード覆号化文字  //
			"g"
		);

		復元.トークン一致パターン = new RegExp
		(
			"([" + R( "[]():," ) + "])|" +						//	構造文字	//
			
			"(?:" + r覆号符 +  "([tfn]))|" +										//	ブーリアン値・ヌル値・空文字列値	//
			
			"(-?\\d+(?:\\.\\d+)?(?:[Ee][-+]\\d+)?)|" +			//	数値	//

			"((" + 												//	文字列値	//
				rc非覆号文字 + "|" +
				r覆号符 + rc単覆号文字 + "|" +                    //  <>{|}` 
				r覆号符 + "[-E\\d\\=]" + "|" +                     //  空・先頭数値・Base64識別
				r覆号符 + "x\\d{4}" + "|" +                      //  16進コード4桁
				r覆号符 + "X\\d{2}" +                            //  16進コード2桁
			")+)",
			"g"
		);

		復元.文字列文字パターン = new RegExp
		(
			"("  +  rc非覆号文字 + "+)|" +
			"(?:"  +  r覆号符 + 
				"("  +  rc単覆号文字  +  ")|" +                    //  <>{|}` 
				"("  +  "[-E\\d\\=]"   +  ")|" +                  //  空・先頭数値・Base64識別
				"("  +  "x\\d{4}"    +  ")|" +                    //  16進コード4桁
				"("  +  "X\\d{2}"    +  ")"  +                    //  16進コード2桁
			")",
			"g"
		);

		復元.ハッシュ外皮除去パターン = new RegExp( "^" + R( 外皮先頭 ) + "|\\w$", "g" );

		復元.構造文字表 =
		{
			"[" : "[" ,
			"]" : "]" ,
			"(" : "{" ,
			")" : "}" ,
			":" : ":" ,
			"," : ","
		};
		
		復元.定値表 = { "t" : "true" , "f" : "false" , "n" : "null" };
		
		変換.文字列覆号表 = {};
		復元.文字列覆号表 = {};

		for( let i in 単覆号文字表 )
		{
			変換.文字列覆号表[ 単覆号文字表[ i ] ]  =  単覆号対応表[ i ];
			復元.文字列覆号表[ 単覆号対応表[ i ] ]  =  単覆号文字表[ i ];
		}
	}
	
	//  変換  //

	{
		変換.外皮を付加 = ( 内容 ) => 外皮先頭 + 内容 + 外皮末尾,

		変換.実行 = ( 値 ) =>
		{
			if( 値 === undefined )  return "";
			if( 値 === null )  return 覆号符 + "n";
			if( 値 === true )  return 覆号符 + "t";
			if( 値 === false )  return 覆号符 + "f";

			if( 値.constructor == String )  return 文字列変換( 値 );
			if( 値.constructor == Number )  return 値.toString();

			if( 値.constructor == Array )
			{
				const 要素連 = [];
				for( let 番号 in 値 )
				{
					const 要素 = 変換.実行( 値[ 番号 ] );
					if( 要素 )  要素連.push( 要素 );
				}
				return "[" + 要素連.join( "," ) + "]";
			}			

			if( 値.constructor == Object )
			{
				const 要素連 = [];
				for( let 名称 in 値 )
				{
					const 要素 = 変換.実行(  値[ 名称 ]  );
					if( 要素 )  要素連.push( 文字列変換( 名称 )  +  ":"  +  要素  );
				}
				return "(" + 要素連.join( "," ) + ")";
			}			

			return "";
		};

		const 文字列変換 = ( 値 ) =>
		{
			if( 値 == "" )  return  覆号符 + "E";

			const uron = 値.replace( 変換.文字列パターン, 文字置換 );
			const base64 = "=" + Base64に変換( 値 );

			return ( uron.length <= ( base64.length * 1.3 ) ? uron : base64 );
		};

		const 文字置換 = ( 全, 先頭覆号, 単覆号, 不変換, その他 ) =>
		{
			if( 不変換 )  return 不変換;
			if( 先頭覆号 )  return 覆号符 + 先頭覆号;
			if( 単覆号 )  return 覆号符 + 変換.文字列覆号表[ 単覆号 ];
			
			const ch = その他.charCodeAt( 0 );
			return 覆号符 +
			(
				ch < 256 ?
					"X" + ch.toString( 16 ).padStart( 2, "0" ) :
					"x" + ch.toString( 16 ).padStart( 4, "0" )
			);
		};
	}

	
	//  復元  //

	復元.実行 = ( uron ) =>
	{
		return uron.replace
		(
			復元.トークン一致パターン,
			復元.トークンからJSONへ復元
		);
	};

	復元.トークンからJSONへ復元 = ( 全, 構造, 定値, 数値, 文字列 ) =>
	{
		console.log( 構造, 定値, 数値, 文字列 );
		if( 構造 )  return  復元.構造文字表[ 構造 ];		//	[]{}:,
		if( 定値 )  return  復元.定値表[ 定値 ];
		if( 数値 )  return  数値;

		return JSON.stringify
		(
			文字列.replace( 復元.文字列文字パターン, 復元.文字を復元 )
		);
	};

	復元.文字を復元 = ( 全, 素, 先頭, 単, コード4, コード2 ) =>
	{
		if( 素 )  return  素;
		return 全;
	};
	
	//  共通  //

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
