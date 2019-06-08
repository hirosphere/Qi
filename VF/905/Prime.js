
//  基本  //

const はい = true;
const いいえ = false;
const なし = null;
const 未定義 = undefined;

const なしを補完 = function( 値, 補完値 ) { return 値 == null ? 補完値 : 値 };
const 未定義補完 = function( 値, 補完値 ) { return 値 === undefined ? 補完値 : 値 };
const 補完 = 未定義補完;

const 型を作成 = function( 典型装飾関数, 基底の型 )
{
	const 典型の型 = function(){};
	{
		典型の型.prototype.初期化 = function(){};

		if( 基底の型 != undefined )
		{
			典型の型.prototype = new 基底の型.典型の型();
		}

		典型装飾関数.call( 典型の型.prototype, 基底の型 && 基底の型.prototype || なし );

	}

	const 型 = function()
	{
		const これ = this;
		これ.初期化.apply( これ, arguments );
	};

	{
		型.典型の型 = 典型の型;
		型.prototype = new 典型の型();

		型.実体を作成 = 型.作成 = function()
		{
			const 実体 = new 型();
			//型.prototype.初期化.apply( 実体, arguments );
			return 実体;
		};
	}

	return 型;
};

const 拡張型を作成 = function( 基底の型, 典型装飾関数 )
{
	return 型を作成( 典型装飾関数, 基底の型 );
};

const 既存の実体を装飾 = function( 実体, 内容, 装飾関数 )
{
	装飾関数 && 装飾関数.call( 実体 );

	if( 内容.フィールド != なし )
	{
		for( let 名前 in 内容.フィールド )
		{
			const 元の名前 = 内容.フィールド[ 名前 ];
			実体[ 名前 ] = 実体[ 元の名前 ];
		}
	}

	if( 内容.プロパティ != なし )
	{
		for( let 名前 in 内容.プロパティ )
		{
			const 元の名前 = 内容.プロパティ[ 名前 ];

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
			const 元の名前 = 内容.イベント[ 名前 ];

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
			"Span", "Img", "Canvas",
			"Table", "TBody", "TH", "TR", "TD", 
			"Form", "Input", "Button", "Select", "Option", "Textarea"
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

	この世界.文字列からBase64に変換 = function( 文字列 )
	{
		return btoa( unescape( encodeURIComponent( 文字列 ) ) );
	};

	この世界.Base64から文字列に復元 = function( base64 )
	{
		try{ return decodeURIComponent( escape( atob( base64 ) ) ); }
		catch( err ) { console.log( base64 ); return ""; }
	};

	let 次の連番 = 1;

	この世界.次の連番 = function( 実体 )
	{
		if( 実体 && 実体.実行時連番 ) return 実体.実行時連番;
		let 連番 = 次の連番 ++;
		if( 実体 ) 実体.実行時連番 = 連番;
		return 連番;
	};

	この世界.JSONから値に = function( json, エラー返り値 )
	{
		try { return JSON.parse( json ); }
		catch( e ) { return エラー返り値; }
	}

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

			タッチスタート: "touchstart",
			タッチムーブ: "touchmove",
			タッチエンド: "touchend",
			タッチキャンセル: "touchcancel",
		},

		フィールド:
		{
			支枝を追加: "appendChild"
		}
	},
	
	function()
	{
		let 典型 = this;

		典型.文を設定 = function( 文 )
		{
			this.innerHTML = 文をHTMLに変換( 文 );
		};

		典型.マウスとタッチ処理を追加 = function( 開始処理, 移動処理, 終了処理, 中止処理 )
		{
			let タッチ中か = いいえ;

			this.タッチスタート処理を追加
			(
				ev =>
				{
					タッチ中か = はい;
					開始処理 && 開始処理( ev );
				}
			);
			
			this.タッチエンド処理を追加
			(
				ev =>
				{
					タッチ中か = いいえ;
					終了処理 && 終了処理( ev );
				}
			);
			
			this.タッチキャンセル処理を追加
			(
				ev =>
				{
					タッチ中か = いいえ;
					中止処理 && 中止処理( ev );
				}
			);

			this.マウスダウン処理を追加( ev => ! タッチ中か && 開始処理 && 開始処理( ev ) );
			this.マウスアップ処理を追加( ev => ! タッチ中か && 終了処理 && 終了処理( ev ) );
		};
	}
);

既存の型を装飾
(
	HTMLCanvasElement,
	{
		プロパティ:
		{
			幅: "width",
			高さ: "height"
		}
	},
	function()
	{
		this.文脈を取得 = function()
		{
			return this.getContext( "2d" );
		};
	}
);


既存の型を装飾
(
	CanvasRenderingContext2D,
	{
		フィールド:
		{
			矩形塗り: "fillRect",
			塗り: "fill",
			描き: "stroke",
			経を開始: "beginPath",
			経を終了: "closePath",
			移動: "moveTo",
			線: "lineTo",
			円弧: "arc",
			//経: "",
		},
		
		プロパティ:
		{
			塗り色: "fillStyle"
		}
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

既存の型を装飾
(
	HTMLSelectElement,
	
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
			停止: "suspend",
			再開: "resume",

			オシレーターを作成: "createOscillator",
			発振器を作成: "createOscillator",

			フィルターを作成: "createBiquadFilter",
			ゲインを作成: "createGain",

			制幅器を作成: "createGain",
			振幅を作成: "createGain",

			"倍音構成を作成": "createPeriodicWave",
			"波形変形器を作成": "createWaveShaper",

			"プロセッサーを作成": "createScriptProcessor",
			"アナライザーを作成": "createAnalyser",
		},
		
		プロパティ:
		{
			出力先: "destination",
			現在時刻: "currentTime",
			状態: "state",
		}
	},

	function()
	{
		let この典型 = this;

		この典型.値ゲインを作成 = function( 初期値 )
		{
			let この実体 = this;

			if( この実体.固定値源 == なし )
			{
				if( この実体.createConstantSource )
				{
					この実体.固定値源 = この実体.createConstantSource( { offset: 1 } );
					この実体.固定値源.start();
				}
				else
				{
					この実体.固定値源 = この実体.createOscillator();
					//この実体.固定値源.type = "square";
					この実体.固定値源.start();

					const 現在時刻 = この実体.現在時刻();
					この実体.固定値源.周波数().その時刻の値( 1, 現在時刻 + 0 );
					この実体.固定値源.周波数().その時刻の値( 0, 現在時刻 + 0.25 );
				}
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
			その時刻の値: "setValueAtTime",
			直線を設定: "linearRampToValueAtTime",
			充放電を設定: "setTargetAtTime",
		},
		プロパティ:
		{
			値: "value"
		}
	},
	function()
	{
		const この典型 = this;

		この典型.予定を破棄 = 
		この典型.自動値を破棄 = this.cancelAndHoldAtTime || this.cancelScheduledValues;
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
			オフセット: "gain",
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
			倍音構成を与える: "setPeriodicWave",
		},

		プロパティ:
		{
			周波数: "frequency",
			ピッチ: "detune",
			波形: "type",
		}
	}
);
