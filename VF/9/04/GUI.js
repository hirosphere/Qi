let タイトルペインの型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, ドキュメント )
		{
			let この実体 = this;

			let エレメント = Divを作成( 幹エレメント, { クラス: "HEAD" } );
			let 表題エレメント = Spanを作成( エレメント, { クラス: "_TITLE" } );

			Buttonを作成( エレメント, { 文: "URLに反映" } );
			Buttonを作成( エレメント, { 文: "ツイート" } );

			ドキュメント.表題.変更処理を追加
			(
				( 文 ) =>
				{
					表題エレメント.文を設定( 文 );
					この文書.表題( ( ローカルホストか ? "● " : "" ) + 文 + " - モハシンセ VF904-1" );
				},
				はい
			);
		};
	}
);

let 運転制御盤1の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名, 列車, 選択器 )
		{
			let この実体 = this;

			let エレメント = Divを作成( 幹エレメント, { クラス: クラス名 } );
			数値表示ペイン1を作成( エレメント, 列車, 選択器 );
			加速度指令ペインを作成( エレメント, 列車 );
		};

		//

		let 数値表示ペイン1を作成 = function( 幹エレメント, 列車, 選択器 )
		{
			let エレメント = Divを作成( 幹エレメント, { クラス: "_DIV1" } );
			let テーブル = 値表示テーブルの型.作成( エレメント, "VT1" );
			let 行 = テーブル.行を作成();
			行.数値項目を作成( "指令加速度", 列車.指令加速度,  はい, "km/h/s", [ 1, 1 ], [ -10, 10, 0.1 ], 選択器 );
			行.数値項目を作成( "調整加速度", 列車.調整指令加速度,  いいえ, "km/h/s", [ 1, 1 ], [ -10, 10, 0.1], 選択器 );
			行.数値項目を作成( "時速", 列車.時速,  いいえ, "km/h", [], [ 0, 500, 1 ], 選択器 );
		};

		let 加速度リスト = [ -4, -3, -2, -1, 0, 1, 2, 3, 4 ];

		let 加速度指令ペインを作成 = function( 幹エレメント, 列車 )
		{
			let この枝 = Divを作成( 幹エレメント, {} );

			for( let 番号 in 加速度リスト )
			{
				let 加速度 = 加速度リスト[ 番号 ];
				let ボタン = Buttonを作成( この枝, { 文: 加速度 } );
				ボタン.クリック処理を追加( ()=> 列車.指令加速度.値を設定( 加速度 ) );
			}
		}
	}
);

let 項目表示1の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名, ドキュメント, シンセ, 選択器 )
		{
			const この実体 = this;
			const 列車 = ドキュメント.列車;
			let 動力 = 列車.動力;

			const エレメント = Divを作成( 幹エレメント, { クラス: クラス名 } );

			{
				let div = Divを作成( エレメント, { クラス: "_MOSEL" } );
				動力選択ペインを作成( div, ドキュメント );
			}

			let テーブル = 値表示テーブルの型.作成( エレメント, "VT2" );

			{
				let 行 = テーブル.行を作成();
				行.文字列項目を作成( "タイトル", ドキュメント.表題,	 はい, 選択器 );
				行.数値項目を作成( "全音量",      シンセ.全音量,	   はい,  "%", [ 1 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "コマ数",    ドキュメント.コマ数, はい, "/秒", [ 2, 2 ], [ 1, 200, 1 ], 選択器 );
			}

			{
				let 行 = テーブル.行を作成();

				行.数値項目を作成( "加速度減衰率", 列車.加速度減衰率, はい, "%", [ 0, 1, 100 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "環境加速度",   列車.環境加速度,  はい, "km/h/s", [ 2, 6 ], [ -1, 1, 0.01 ], 選択器 );
				行.数値項目を作成( "加速度",      列車.加速度,  いいえ, "km/h/s", [ 2, 6 ], [ -10, 10, 0.1 ], 選択器 );
				行.数値項目を作成( "秒速",        列車.時速,	 いいえ, "m/s", [ 1, 3, 1/3.6 ], [ 0, 100, 1 ], 選択器 );
			}

			{
				let 行 = テーブル.行を作成();
				行.数値項目を作成(	"モーター周波数",	動力.モーター周波数,  いいえ,  "Hz", [ 1, 3 ], [ 0, 200, 1 ],	選択器 );
				行.数値項目を作成( 	"ファン周波数",		動力.ファン周波数,    いいえ,  "Hz", [ 0, 1 ],    [ 0, 2000, 1 ],	選択器 );
				行.数値項目を作成(	"噛み合い周波数",	動力.噛み合い周波数,  いいえ,  "Hz", [ 0, 1 ],    [ 0, 2000, 1 ],	選択器 );
				行.数値項目を作成(	"整流子周波数",		動力.整流子周波数,    いいえ,  "Hz", [ 0, 1 ],       [ 0, 8000, 1 ],	選択器 );
				行.数値項目を作成(	"車輪回転周波数",	動力.車輪回転周波数,  いいえ,  "Hz", [ 2, 2 ], [ 0, 20, 0.1 ],	選択器 );
			}

			{
				let 行 = テーブル.行を作成();

				行.数値項目を作成(	"冷却ファン羽数", 動力.冷却ファン羽数, はい, "", [], [ 4, 32, 1 ],	選択器 );
				行.数値項目を作成(	"駆動歯数",	動力.駆動歯数,	はい,	"", [],    [ 12, 28, 1 ],	選択器 );
				行.数値項目を作成(	"被動歯数",	動力.被動歯数,	はい,	"", [],     [ 70, 120, 1 ],	選択器 );
				行.数値項目を作成(	"減速比",	動力.減速比,	いいえ,	"", [ 2, 6 ],  [ 1, 10, 0.01 ],	選択器 );
				行.数値項目を作成(	"整流子数",	動力.整流子数,	はい,	"", [],      [ 26, 74, 1 ],	選択器 );
				行.数値項目を作成(	"車輪径",	動力.車輪径,	はい,	"mm", [ 0 ],  [ 800, 1000, 1 ],	選択器 );
			};

			{
				let 行 = テーブル.行を作成();
				行.数値項目を作成( "モーター音量",  シンセ.モーター音量,  はい,  "%", [ 1 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "ファン音量",    シンセ.ファン音量,   はい,  "%", [ 1 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "歯車音量",      シンセ.歯車音量,     はい,  "%", [ 1 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "加速度音量",      シンセ.加速度音量, いいえ, "%", [ 1, 1, 100 ], [ 0, 100, 1 ], 選択器 );
				行.数値項目を作成( "整流子音量",    シンセ.整流子音量,   はい,   "%", [ 1 ], [ 0, 100, 1 ], 選択器 );
			}
		};

		const 動力選択ペインを作成 = function( 幹エレメント, ドキュメント )
		{
			const select = Selectを作成( 幹エレメント );
			const リスト = ドキュメント.動力設定リスト;
			const options = {};

			options[ "" ] = Optionを作成( select, { 文: "", 属性: { 項目名: "" } } );
			
			for( let 名称 in リスト )
			{
				let 項目 = リスト[ 名称 ];
				let option = options[ 名称 ] =
					Optionを作成( select, { 文: `${ リスト[ 名称 ][ 6 ] } (${ 名称 })` } )
				;
				option.項目名 = 名称;
			}

			select.入力処理を追加
			(
				()=>
				{
					const option = select.options[ select.selectedIndex ];
					ドキュメント.動力選択.値を設定( option.項目名 );
				}
			);

			ドキュメント.動力選択.変更処理を追加
			(
				( 名称 )=>
				{
					//console.log( 名称 );
					( options[ 名称 ] || options[ "" ] ).selected = はい;
				},
				はい
			);
		};
	}
);

let 値表示テーブルの型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名 )
		{
			let この実体 = this;

			let table = Tableを作成( 幹エレメント, { クラス: クラス名 } );
			この実体.tbody = TBodyを作成( table );
		};

		この典型.行を作成 = function()
		{
			return new 行の型( this.tbody );
		};

		let 行の型 = function( tbody )
		{
			let この実体 = this;
			let 題行TR = TRを作成( tbody, { クラス: "_TROW" } );
			let 値行TR = TRを作成( tbody, { クラス: "_VROW" } );

			この実体.項目を作成2 = function( 設定 )
			{
				return 数値表示テーブル項目2の型.作成( 題行TR, 値行TR, 設定 );
			};

			この実体.数値項目を作成 = function( 表題, セル, 可変か, 単位, 表示設定, レンジ設定, 選択器 )
			{
				let 設定 =
				{
					型名: "数値", 表題: 表題, セル: セル, 可変か: 可変か, 単位: 単位, 選択器: 選択器,
					数値: { 表示小数長: 表示設定[ 0 ], 入力小数長: 表示設定[ 1 ], 倍率: 表示設定[ 2 ] },
					レンジ: { 下限: レンジ設定[ 0 ], 上限: レンジ設定[ 1 ], 段階: レンジ設定[ 2 ], 粗段階: レンジ設定[ 3 ] },
				}
				return 値表示テーブル項目の型.作成( 題行TR, 値行TR, 設定 );
			};

			この実体.文字列項目を作成 = function( 表題, セル, 可変か, 選択器 )
			{
				let 設定 =
				{
					型名: "文字列", 表題: 表題, セル: セル, 可変か: 可変か, 選択器: 選択器,
				}
				return 値表示テーブル項目の型.作成( 題行TR, 値行TR, 設定 );
			};
		}
	}
);

const 値表示テーブル項目の型 = 型を作成
(
	function()
	{
		const この典型 = this;

		この典型.開始する = function( 題TR, 値TR, 設定 )
		{
			const この実体 = this;

			設定.数値 = 設定.数値 || {};
			この実体.設定 = 設定;

			この実体.題TD = TDを作成( 題TR, { クラス: "_TITLE" + ( 設定.可変か ? " _EDITABLE" : "" ), 文: 設定.表題 } );
			この実体.値TD = TDを作成( 値TR, { クラス: "_VCELL" } );
			{
				この実体.選択枠Span = Spanを作成( この実体.値TD, { クラス: "_SELFRAME" } );
				{
					この実体.値Span =
					Spanを作成( この実体.選択枠Span, { クラス: "_VALUE" } );
					Spanを作成( この実体.選択枠Span, { クラス: "_UNIT", 文: 設定.単位 || "" } );
				}
			}

			この実体.値TD.onmousedown = function() { if( 設定.選択器 ) 設定.選択器.選択( この実体 ) };

			設定.セル && 設定.セル.変更処理を追加( ()=> この実体.値表示を更新(), はい );
		};

		この典型.選択状態を設定 = function( 値 )
		{
			const この実体 = this;

			値 ?
				この実体.選択枠Span.classList.add( "_SELECTED" ) :
				この実体.選択枠Span.classList.remove( "_SELECTED" )
			;
		};

		この典型.値表示を更新 = function()
		{
			const この実体 = this;
			この実体.値Span.文を設定( 表示文字を得る( この実体.設定 ) );
		};

		function 表示文字を得る( 設定 )
		{
			if( 設定.型名 == "数値" ) return 小数を整理( 設定.セル.値 * 補完( 設定.数値.倍率, 1 ), 設定.数値.表示小数長 || 0 )
			return 設定.セル.値;
		}
	}
);

const 単一選択の型 = 拡張型を作成
(
	値の型,
	function( 基底の典型 )
	{
		let この典型 = this;

		この典型.開始する = function()
		{
			let この実体 = this;
			基底の典型.開始する.call( この実体 );

			この実体.カレント = なし;
		};

		この典型.選択 = function( 項目 )
		{
			let この実体 = this;
			
			if( この実体.値 == 項目 )  return;

			この実体.値 && この実体.値.選択状態を設定( いいえ );
			この実体.値を設定( 項目 );
			この実体.値 && この実体.値.選択状態を設定( はい );
		};
	}
);

let 入力ペインの型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名 )
		{
			let この実体 = this;
			この実体.値変更処理 = () => この実体.値表示を更新();

			let エレメント = Divを作成( 幹エレメント, { クラス: クラス名 } );
			この実体.表題表示 = Spanを作成( エレメント, { クラス: "_TITLE" } );
			この実体.文字入力 = Inputを作成( エレメント, { クラス: "_TEXT" } );
			この実体.単位表示 = Spanを作成( エレメント, { クラス: "_UNIT" } );
			let 減ボタン = Buttonを作成( エレメント, { 文: "減" } );
			let 増ボタン = Buttonを作成( エレメント, { 文: "増" } );
			この実体.レンジ = Inputを作成( エレメント, { クラス: "_RANGE", 属性: { type: "range" } } );

			この実体.文字入力.変更処理を追加( () => この実体.文字入力を反映() );
			この実体.レンジ.入力処理を追加( () => この実体.レンジ入力を反映() );

			let r = この実体.レンジ;
			減ボタン.クリック処理を追加( () => { r.value -= r.step; この実体.レンジ入力を反映(); } );
			増ボタン.クリック処理を追加( () => { r.value -= - r.step; この実体.レンジ入力を反映(); } );
		};

		この典型.項目を設定 = function( 項目 )
		{
			const この実体 = this;

			if( この実体.項目 ) この実体.項目.設定.セル.変更処理を削除( この実体.値変更処理 );
			
			この実体.項目 = 項目;

			const 設定 = 項目 && 項目.設定;
			{
				この実体.表題表示.文を設定( 設定 && 設定.表題 || "" );
				この実体.単位表示.文を設定( 設定 && 設定.単位 || "" );
			}
			
			{
				const レンジ設定 = 設定 && 設定.レンジ;
				この実体.レンジ.min = レンジ設定 && レンジ設定.下限 || 0;
				この実体.レンジ.max = レンジ設定 && レンジ設定.上限 || 100;
				この実体.レンジ.step = レンジ設定 && レンジ設定.段階 || 1;
			}
			if( 項目 ) この実体.項目.設定.セル.変更処理を登録( この実体.値変更処理, はい );
		};

		この典型.値表示を更新 = function()
		{
			const この実体 = this;
			const 設定 = この実体.項目 && この実体.項目.設定;
			const 数値 = 設定 && 設定.数値;

			if( 設定.型名 == "数値" )
			{
				この実体.文字入力.value =
				この実体.レンジ.value =
					小数を整理
					(
						設定.セル.値 * 補完( 設定.数値.倍率, 1 ),
						補完( 設定.数値.入力小数長, 0 )
					)
				;
			}
			else if( 設定.型名 == "文字列" )
			{
				この実体.文字入力.value = 設定.セル.値;
				この実体.レンジ.value = 0;
			}
			else
			{
				この実体.文字入力.value = "";
				この実体.レンジ.value = 0;
			}
		};

		この典型.文字入力を反映 = function()
		{
			const この実体 = this;
			const セル = この実体.項目 && この実体.項目.設定.セル;

			セル && セル.値を設定( この実体.入力値から値を得る( この実体.文字入力.value ) );
		};

		この典型.レンジ入力を反映 = function()
		{
			const この実体 = this;
			const セル = この実体.項目 && この実体.項目.設定.セル;
			セル && セル.値を設定( この実体.入力値から値を得る( この実体.レンジ.value ) );
		};

		この典型.入力値から値を得る = function( 入力値 )
		{
			let この実体 = this;
			const 設定 = この実体.項目.設定;
			const 数値 = 設定 && 設定.数値;
			if( 設定 && 設定.型名 == "数値" ) return 入力値 / 補完( 数値.倍率, 1 );
			return 入力値;
		};
	}
);
