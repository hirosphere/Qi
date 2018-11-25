
let 運転制御盤1の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名, 列車, 選択器 )
		{
			let この実体 = this;

			let この枝 = Divを作成( 幹エレメント, { クラス: クラス名 } );
			数値表示ペイン1を作成( この枝, 列車, 選択器 );
			加速度指令ペインを作成( この枝, 列車 );
			数値表示ペイン2を作成( この枝, 列車, 選択器 );
		};

		//

		let 数値表示ペイン1を作成 = function( 幹エレメント, 列車, 選択器 )
		{
			let テーブル = 数値表示テーブルの型.作成( 幹エレメント, "VT1" );
			let 行 = テーブル.行を作成();
			行.項目を作成( "指令加速度", 列車.指令加速度, true, [ 1, "km/h/s" ], 選択器 );
			行.項目を作成( "減衰加速度", 列車.減衰加速度, false, [ 1, "km/h/s" ], 選択器 );
			行.項目を作成( "時速", 列車.時速, false, [ 0, "km/h" ], 選択器 );
		};

		let 加速度リスト = [ -5, -3, -2, -1, 0, 1, 2, 3, 5 ];

		let 加速度指令ペインを作成 = function( 幹エレメント, 列車 )
		{
			let この枝 = Divを作成( 幹エレメント, {} );

			for( let 番号 in 加速度リスト )
			{
				let 加速度 = 加速度リスト[ 番号 ];
				let ボタン = Buttonを作成( この枝, { 文: 加速度 } );
				ボタン.クリック( ()=> 列車.指令加速度.値を設定( 加速度 ) );
			}
		}

		let 数値表示ペイン2を作成 = function( 幹エレメント, 列車, 選択器 )
		{
			let テーブル = 数値表示テーブルの型.作成( 幹エレメント, "VT2" );
			{
				let 行 = テーブル.行を作成();
				行.項目を作成( "加速度減衰率", 列車.加速度減衰率, true, [ 1, "%", (v)=>v*100, (m)=>v/100 ], 選択器 );
				行.項目を作成( "環境加速度", 列車.環境加速度, true, [ 2, "km/h/s" ], 選択器 );
				行.項目を作成( "加速度", 列車.加速度, false, [ 2, "km/h/s" ], 選択器 );
				行.項目を作成( "秒速", 列車.時速, false, [ 1, "m/s", (v)=>v/3.6, (v)=>v*3.6 ], 選択器 );
			}
			let 動力 = 列車.動力;
			{
				let 行 = テーブル.行を作成();
				行.項目を作成( "モーター周波数", 動力.モーター周波数, false, [ 1, "Hz" ], 選択器 );
				行.項目を作成( "ファン周波数", 動力.ファン周波数, false, [ 1, "Hz" ], 選択器 );
				行.項目を作成( "噛み合い周波数", 動力.噛み合い周波数, false, [ 1, "Hz" ], 選択器 );
				行.項目を作成( "排気穴周波数", 動力.排気穴周波数, false, [ 1, "Hz" ], 選択器 );
				行.項目を作成( "車輪回転周波数", 動力.車輪回転周波数, false, [ 1, "Hz" ], 選択器 );
			}
		};
	}
);

let 項目表示1の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, クラス名, 列車, 選択器 )
		{
			const この実体 = this;

			const この枝 = Divを作成( 幹エレメント, { クラス: クラス名 } );
			数値表示ペインを作成( この枝, 列車.動力, 選択器 );
		};

		const 数値表示ペインを作成 = function( 幹エレメント, 動力, 選択器 )
		{
			let テーブル = 数値表示テーブルの型.作成( 幹エレメント, "VT2" );
			let 行 = テーブル.行を作成();
			行.項目を作成( "冷却ファン羽数", 動力.冷却ファン羽数, true, [ 1, "" ], 選択器 );
			行.項目を作成( "駆動歯数", 動力.駆動歯数, true, [ 1, "" ], 選択器 );
			行.項目を作成( "被動歯数", 動力.被動歯数, true, [ 1, "" ], 選択器 );
			行.項目を作成( "減速比", 動力.減速比, false, [ 2, "", なし, なし, (m)=>`1:${m}` ], 選択器 );
			行.項目を作成( "排気穴数", 動力.排気穴数, true, [ 1, "" ], 選択器 );
			行.項目を作成( "車輪径", 動力.車輪径, true, [ 1, "mm" ], 選択器 );
		};
	}
);

let 数値表示テーブルの型 = 型を作成
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
			let 題行枝 = TRを作成( tbody, { クラス: "_TROW" } );
			let 値行枝 = TRを作成( tbody, { クラス: "_VROW" } );

			この実体.項目を作成 = function( 表題, 値, 可変, 表示設定, 選択器 )
			{
				return 数値表示テーブル項目の型.作成( 題行枝, 値行枝, 表題, 値, 可変, 表示設定, 選択器 );
			};
		}
	}
);

const 数値表示テーブル項目の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 題TR, 値TR, 表題, 値, 可変か, 表示設定, 選択器 )
		{
			let この実体 = this;

			この実体.値 = 値;
			この実体.表示設定 = 表示設定;
			この実体.値から表示文字列へ変換 = 表示設定[ 2 ] || ( (v)=>v );

			この実体.題TD = TDを作成( 題TR, { クラス: "_TITLE" + ( 可変か ? " _EDITABLE" : "" ), 文: 表題 } );
			この実体.値TD = TDを作成( 値TR, { クラス: "_VCELL" } );
			{
				この実体.選択枠Span = Spanを作成( この実体.値TD, { クラス: "_SELFRAME" } );
				{
					この実体.値Span =
					Spanを作成( この実体.選択枠Span, { クラス: "_VALUE" } );
					Spanを作成( この実体.選択枠Span, { クラス: "_UNIT", 文: 表示設定[ 1 ] } );
				}
			}

			この実体.値TD.onmousedown = function() { if( 選択器 ) 選択器.選択( この実体 ) };

			値.変更された( ()=> この実体.数値表示を更新() );
		};

		この典型.選択状態を設定 = function( 値 )
		{
			let この実体 = this;

			値 ?
				この実体.選択枠Span.classList.add( "_SELECTED" ) :
				この実体.選択枠Span.classList.remove( "_SELECTED" )
			;
		};

		この典型.数値表示を更新 = function()
		{
			let この実体 = this;

			この実体.値Span.文を設定
			(
				小数を整理
				(
					この実体.値から表示文字列へ変換( この実体.値.値 ),
					この実体.表示設定[ 0 ]
				)
			);
		};
	}
);

const 単一選択の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function()
		{
			let この実体 = this;

			この実体.カレント = なし;
		};

		この典型.選択 = function( 実体 )
		{
			let この実体 = this;
			
			if( この実体.カレント == 実体 )  return;

			この実体.カレント && この実体.カレント.選択状態を設定( いいえ );
			この実体.カレント = 実体;
			この実体.カレント && この実体.カレント.選択状態を設定( はい );
		};
	}
);

let 数値入力ペインの型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function()
		{
			let この実体 = this;
		};
	}
);
