
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

	型.実体を作成 = 型.作成 = function()
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

let 既存の実体を装飾 = function( 実体, 内容, 装飾関数 )
{
	装飾関数 && 装飾関数.call( 実体 );

	if( 内容.フィールド != なし )
	{
		for( let 名前 in 内容.フィールド )
		{
			let 元の名前 = 内容.フィールド[ 名前 ];
			実体[ 名前 ] = 実体[ 元の名前 ];
		}
	}

	if( 内容.プロパティ != なし )
	{
		for( let 名前 in 内容.プロパティ )
		{
			let 元の名前 = 内容.プロパティ[ 名前 ];

			実体[ 名前 ] = function( 値 )
			{
				if( arguments.length >= 1 )  this[ 元の名前 ] = 値;
				return this[ 元の名前 ];
			};
		}
	}

	if( 内容.イベント != なし )
	{
		for( let 名前 in 内容.イベント )
		{
			let 元の名前 = 内容.イベント[ 名前 ];

			実体[ 名前 ] = function( 処理, オプション )
			{
				this.addEventListener( 元の名前, 処理, オプション );
			};
		}
	}

	return 実体;
};

let 既存の型を装飾 = function( 既存の型, 内容, 典型装飾関数 )
{
	既存の実体を装飾( 既存の型.prototype, 内容, 典型装飾関数 );

	既存の型.作成 = function()
	{
		let 実体 = new 既存の型();
		return 実体;
	};

	return 既存の型;
};

//  基本型・実体装飾  //

//  DOM, HTML, 利便  //

let この世界 = 既存の実体を装飾
(
	window,
	{
		フィールド:
		{
			時限を設定: "setTimeout",
			間欠を設定: "setInterval",
		}
	}
);

let この文書 = 既存の実体を装飾
(
	document,
	{
		フィールド:
		{
			Idで: "getElementById"
		},
		プロパティ:
		{
			表題: "title"
		}
	}
);


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

	この世界.少数を整理 = function( 値, 桁数 )
	{
		let 乗除 = Math.pow( 10, 桁数 );
		return Math.round( 値 * 乗除 ) / 乗除;
	};

	この世界.エレメントを作成 = function( タイプ名, 幹エレメント, その他 )
	{
		let エレメント = document.createElement( タイプ名 );
		if( その他 != なし )
		{
			if( その他.属性 != なし )  for( let 名前 in その他.属性 )  エレメント[ 名前 ] = その他.属性[ 名前 ];
			if( その他.文 != なし ) エレメント.文を設定( その他.文 );
			if( その他.クラス != なし ) エレメント.className = その他.クラス;
		}
		if( 幹エレメント != なし ) 幹エレメント.appendChild( エレメント );
		return エレメント;
	};

	for
	(
		let Type of
		[
			"Div", "H1", "H2", "H3", "H4", "H5", "H6", "P",
			"Article", "Header",
			"Span",
			"Table", "TBody", "TH", "TR", "TD", 
			"Form", "Input", "Button"
		]
	)
	{
		let type = Type.toLowerCase();

		この世界[ Type + "を作成" ] = function( 幹エレメント, その他 )
		{
			return エレメントを作成( type, 幹エレメント, その他 );
		};
	}
	
	この世界.スライダーを作成 = function( 幹エレメント, その他 )
	{
		return エレメントを作成( "input", 幹エレメント, その他 );
	};

};

let ローカルホストか = location.host.match( /localhost$/i ) != null;

//  ブラウザオブジェクト  //

既存の型を装飾
(
	HTMLElement,
	{
		イベント:
		{
			クリック: "click",
			マウスダウン: "mousedown",
			マウスアップ: "mouseup",
			マウスムーブ: "mousemove",
		}
	},
	function()
	{
		let 典型 = this;

		典型.文を設定 = function( 文 )
		{
			this.innerHTML = 文をHTMLに変換( 文 );
		};
	}
);

既存の型を装飾
(
	HTMLInputElement,
	
	{
		イベント:
		{
			入力された: "input",
			変更された: "change",
		}
	}
);

// . Audio API //

let 音響文脈の型 = 既存の型を装飾
(
	AudioContext,
	{
		フィールド:
		{
			オシレーターを作成: "createOscillator",
			フィルターを作成: "createBiquadFilter",
			ゲインを作成: "createGain",
			倍音表を作成: "createPeriodicWave",
		},

		プロパティ:
		{
			出力: "destination",
			現在時刻: "currentTime"
		}
	}
);

既存の型を装飾
(
	AudioParam,
	{
		フィールド:
		{
			その時の値: "setValueAtTime",
			その時へ直線変化: "linearRampToValueAtTime"
		},
		プロパティ:
		{
			値: "value"
		}
	}
);

既存の型を装飾
(
	AudioNode,
	{
		フィールド:
		{
			接続: "connect",
			切断: "disconnect",
		}
	},
);

既存の型を装飾
(
	GainNode,
	{
		プロパティ:
		{
			ゲイン: "gain",
			利得: "gain",
		}
	}
);

既存の型を装飾
(
	OscillatorNode,
	{
		フィールド:
		{
			開始: "start",
			終了: "stop",
		},

		プロパティ:
		{
			周波数: "frequency"
		}
	},
	function()
	{
		;
	}
);
