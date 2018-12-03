
//  基本  //

let はい = true;
let いいえ = false;
let なし = null;
let 未定義 = undefined;

let 型を作成 = function( 典型装飾関数, 基底の型 )
{
	let 型 = function(){};

	if( 基底の型 != undefined )
	{
		型.prototype = new 基底の型();
	}

	典型装飾関数.call( 型.prototype, 基底の型 && 基底の型.prototype || なし );

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

			実体[ 名前 + "処理を追加" ] = function( 処理, オプション )
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
			時限を解除: "clearTimeout",
			間欠を設定: "setInterval",
			間欠を解除: "clearInterval",
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

	この世界.エレメントを作成 = function( タイプ名, 幹エレメント, その他 )
	{
		let エレメント = document.createElement( タイプ名 );
		if( その他 != なし )
		{
			if( その他.属性 != なし )  for( let 名前 in その他.属性 )  エレメント[ 名前 ] = その他.属性[ 名前 ];
			if( その他.スタイル != なし )  for( let 名前 in その他.スタイル )  エレメント.style[ 名前 ] = その他.スタイル[ 名前 ];
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
	
	//  //

	この世界.小数を整理 = function( 値, 桁数 )
	{
		let 乗除 = Math.pow( 10, 桁数 );
		return Math.round( 値 * 乗除 ) / 乗除;
	};

	let 次の連番 = 1;

	この世界.次の連番 = function( 実体 )
	{
		if( 実体 && 実体.実行時連番 ) return;
		let 連番 = 次の連番 ++;
		if( 実体 ) 実体.実行時連番 = 連番;
		return 連番;
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
			入力: "input",
			変更: "change",
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
			発振器を作成: "createOscillator",
			フィルターを作成: "createBiquadFilter",
			ゲインを作成: "createGain",
			制幅器を作成: "createGain",
			振幅を作成: "createGain",
			倍音表を作成: "createPeriodicWave",
			波形変形器を作成: "createWaveShaper",
		},
		プロパティ:
		{
			出力: "destination",
			現在時刻: "currentTime"
		}
	},
	function()
	{
		let この典型 = this;

		この典型.固定値を作成 = function( 初期値 )
		{
			let この実体 = this;

			if( この実体.固定値源 == なし )
			{
				この実体.固定値源 = この実体.発振器を作成();
				この実体.固定値源.周波数().値( 10 );
				この実体.固定値源.開始();
				この実体.固定値源.周波数().その時刻の値( 0, この実体.現在時刻() + 0.025 );
			}

			let 制幅器 = この実体.制幅器を作成();
			この実体.固定値源.接続( 制幅器 );
			制幅器.振幅().値( 初期値 );
			return 制幅器;
		};
	}
);

既存の型を装飾
(
	AudioParam,
	{
		フィールド:
		{
			その時の値: "setValueAtTime",
			その時刻の値: "setValueAtTime",
			その時へ直線変化: "linearRampToValueAtTime",
			その時刻へ直線変化: "linearRampToValueAtTime",
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
			振幅: "gain",
			利得: "gain",
		}
	},
	function()
	{
		let この典型 = this;

		この典型.後続を作成 = function( 初期値 )
		{
			let この実体 = this;
			let 後続 = この実体.context.制幅器を作成();
			この実体.接続( 後続 );
			後続.振幅().値( 初期値 );
			return 後続;
		};
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
			周波数: "frequency",
			ピッチ: "detune",
			波形: "type",
		}
	}
);
