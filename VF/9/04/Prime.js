
//  基本  //

let なし = null;
let 未定義 = undefined;

let 型を作成 = function( 典型装飾関数, 基底の型 )
{
	let 型 = function(){};

	if( 基底の型 != undefined )
	{
		型.prototype = new 基底の型();
	}

	典型装飾関数.call( 型.prototype );

	if( 型.prototype.開始する == undefined )
	{
		型.prototype.開始する = function(){};
	}

	型.作成 = function()
	{
		let 実体 = new 型();
		型.prototype.開始する.apply( 実体, arguments );
		return 実体;
	};

	return 型;
};

let 拡張型を作成 = function( 基底の型, 典型装飾関数 )
{
	return 型を作成( 典型装飾関数, 基底の型 );
};

let 既存の実体を装飾 = function( 実体, 装飾関数 )
{
	let 装飾返り値 = 装飾関数.call( 実体 );
};

let 既存の型を装飾 = function( 既存の型, 典型装飾関数 )
{
	let 装飾返り値 = 既存の実体を装飾( 既存の型.prototype, 典型装飾関数 );

	既存の型.作成 = function()
	{
		let 実体 = new 既存の型();

		return 実体;
	};
};

let この世界 = window;
let この文書 = document;

//  DOM, HTML  //

new function()
{
	この世界.文をHTMLに変換 = function( 文 )
	{
		return ( "" + 文 ).replace( /<|>|&|  | |\t|\r\n|\r|\n/g, hp_rep );
	};

	var ht_rep_table =
	{
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;", 
		"  ": " &nbsp;",
		" ": "&nbsp;", 
		"\t": "&nbsp&nbsp&nbsp&nbsp;", 
		"\r\n": "<br/>\r\n",
		"\r": "<br/>\r\n",
		"\n": "<br/>\r\n" 
	};
	
	function hp_rep( ch )  {  return ht_rep_table[ ch ];  }

	//  //

	この世界.桁を整理 = function( 値, 規模 )
	{
		return Math.round( 値 / 規模 ) * 規模;
	};

	;
};

//  ブラウザオブジェクト  //

既存の型を装飾
(
	HTMLElement,
	function()
	{
		let 典型 = this;

		典型.文を設定 = function( 文 )
		{
			this.innerHTML = 文をHTMLに変換( 文 );
		};

		let イベント =
		{
			クリックされた: "click",
		};

		return [ イベント ];
	}
);

既存の実体を装飾
(
	この文書,
	function()
	{
		let この実体 = this;

		この実体.Idでエレメント取得 = this.getElementById;

		return { イベント: なし };
	}
);

// . Audio API //

