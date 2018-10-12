
// 基本 //

let 真 = true;
let 偽 = false;

let 立っている = true;
let たっている = true;
let 座っている = false;
let すわっている = false;

let 起きている = true;
let 寝ている = false;

let 無 = null;
let 無し = null;
let なし = null;

function 在りますか( 実体の参照 ) { return 実体の参照 != なし; }
let 在るか = 在りますか;
let 存在しますか = 在りますか;
let 存在するか = 在りますか;


function 型をつくります( 基底の型, 型の内容 )
{
	let うらの型 = function(){};
	if( 基底の型 ) うらの型.prototype = new 基底の型.うら();

	型の内容.call( うらの型.prototype, 基底の型 && 基底の型.prototype );
	if( うらの型.prototype.はじめる == なし )  うらの型.prototype.はじめる = function(){};

	let この型 = function()
	{
		this.はじめる.apply( this, arguments );
	};

	この型.prototype = new うらの型();
	この型.うら = うらの型;
	return この型;
}

function 既存の型を装飾します( 型, 内容 )
{
	既存の実体を装飾します( 型.prototype, 内容 );
	return 型;
}

function 既存の実体を装飾します( 実体, 内容 )
{
	if( 内容.メソッド )
	{
		let リスト = 内容.メソッド;
		for( let 番号 in リスト )
		{
			実体[ リスト[ 番号 ][ 0 ] ] = 実体[ リスト[ 番号 ][ 1 ] ];
		}
	}

	if( 内容.イベント )
	{
		let リスト = 内容.イベント;
		for( let 番号 in リスト )
		{
			実体[ リスト[ 番号 ][ 0 ] + "された" ] = function( 処理, オプション )
			{
				this.addEventListener( リスト[ 番号 ][ 1 ], 処理, オプション );
			};
		}
	}

	if( 内容.プロパティ )
	{
		let リスト = 内容.プロパティ;
		for( let 番号 in リスト )
		{
			実体[ リスト[ 番号 ][ 0 ] ] = function( 値 )
			{
				if( arguments.length ) this[ リスト[ 番号 ][ 1 ] ] = 値;
				return this[ リスト[ 番号 ][ 1 ] ];
			};
		}
	}

	return 実体;
};

let 値の型 = 型をつくります
(
	なし,
	function()
	{
		let この型 = this;
		
		この型.はじめる = function( 初期値 )
		{
			let この実体 = this;
			この実体.初期値 = この実体.値 = 初期値;
		};

		この型.値を設定 = function( 値 )
		{
			let この実体 = this;
			この実体.値 = 値;
		};
	}
);

// この世界 //

let この世界 = window;
let この文書 = この世界.文書 = document;

既存の実体を装飾します
(
	window,
	{
		メソッド:
		[
			[ "時限を設定", "setTimeout" ],
			[ "間欠を設定", "setInterval" ],
		]
	}
);


let コンソール = 既存の実体を装飾します
(
	console,
	{
		メソッド:
		[
			[ "ログ", "log" ],
			[ "クリアー", "clear" ],
		]
	}
);

既存の型を装飾します
(
	HTMLDocument,
	{
		イベント: {},
		プロパティ:
		[
			[ "タイトル", "title", "RW" ]
		]
	}
);

// 文書・エレメント //

let エレメントの型 = 既存の型を装飾します
(
	HTMLElement,
	{
		イベント:
		[
			[ "キーダウン", "keydown" ],
			[ "キーアップ", "keyup" ],
			[ "キープレス", "keypress" ],

			[ "マウスダウン", "mousedown" ],
			[ "マウスムーブ", "mousemove" ],
			[ "マウスアップ", "mouseup" ],
			[ "クリック", "click" ],

			[ "タッチスタート", "touchstart" ],
			[ "タッチムーブ", "touchmove" ],
			[ "タッチエンド", "touchend" ],
			[ "タッチキャンセル", "touchcancel" ],
		]
	}
);

既存の型を装飾します
(
	Event,
	{
		メソッド:
		[
			[ "本来の動作を阻止", "preventDefault" ],
			[ "上達を阻止", "stopPropagation" ]
		]
	}
)

// 便利 //

let 便利 = new function()
{
	let これ = this;
	let それ = この世界;

	それ.エレメントをつくれ = function( 型, 幹のエレメント, その他 )
	{
		let エレメント = この世界.文書.createElement( 型 );

		if( その他 != null )
		{
			if( その他.文 != null ) エレメント.innerHTML = これ.文をHTMLに変換します( その他.文 );
			if( その他.クラス != null ) エレメント.className = その他.クラス;
		}

		if( 幹のエレメント ) 幹のエレメント.appendChild( エレメント );
		return エレメント;
	};

	それ.divエレメントをつくれ = function( 幹のエレメント, その他 ) { return それ.エレメントをつくれ( "div", 幹のエレメント, その他 ); };
	それ.pエレメントをつくれ = function( 幹のエレメント, その他 ) { return それ.エレメントをつくれ( "p", 幹のエレメント, その他 ); };
	それ.xエレメントをつくれ = function( 幹のエレメント, その他 ) { return それ.エレメントをつくれ( "", 幹のエレメント, その他 ); };

	それ.ボタンをつくれ = function( 幹のエレメント, その他 )
	{
		return それ.エレメントをつくれ( "button", 幹のエレメント, その他 );
	};

	それ.スライダーをつくれ = function( 幹のエレメント, その他 )
	{
		let エレメント = それ.エレメントをつくれ( "input", 幹のエレメント, その他 );
		エレメント.type = "range";
		return エレメント;
	};

	それ.xエレメントをつくれ = function( 幹のエレメント, その他 )
	{
		return それ.エレメントをつくれ( "button", 幹のエレメント, その他 );
	};

	それ.xエレメントをつくれ = function( 幹のエレメント, その他 )
	{
		return それ.エレメントをつくれ( "button", 幹のエレメント, その他 );
	};

	これ.文をHTMLに変換します = function( 文 )
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

	それ.桁を整理 = function( 値, 桁数 )
	{
		let スケール = Math.pow( 10, - 桁数 );
		return Math.round( 値 * スケール ) / スケール;
	};

};

let べんり = 便利;
let べ = 便利;
let 便 = 便利;


// 音響文脈 //

let 音響文脈の型 = 既存の型を装飾します
(
	AudioContext,
	{
		メソッド:
		[
			[ "オシレーターを作成", "createOscillator" ],
			[ "フィルターを作成", "createBiquadFilter" ],
			[ "ゲートを作成", "createGain" ],
			[ "アンプを作成", "createGain" ]
		],

		プロパティ:
		[
			[ "いまの時刻", "currentTime" ],
			[ "出力先", "destination" ],
		]
	}
);

既存の型を装飾します
(
	AudioParam,
	{
		メソッド:
		[
		],

		プロパティ:
		[
			[ "値", "value" ],
		]
	}
);

既存の型を装飾します
(
	AudioNode,
	{
		メソッド:
		[
			[ "接続", "connect" ],
		],

		プロパティ:
		[
			[ "チャンネル数", "channelCount" ],
		]
	}
);

既存の型を装飾します
(
	OscillatorNode,
	{
		メソッド:
		[
			[ "開始", "start" ],
			[ "終了", "stop" ],
		],

		プロパティ:
		[
			[ "周波数", "frequency" ],
		]
	}
);

既存の型を装飾します
(
	GainNode,
	{
		プロパティ:
		[
			[ "ゲイン", "gain" ],
		]
	}
);


