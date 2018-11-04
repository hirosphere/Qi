
let 運転制御盤1の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 幹エレメント, その他 )
		{
			let この実体 = this;

			let この枝 = Divを作成( 幹エレメント, { クラス: その他.クラス名 } );
			数値表示ペイン1を作成( この枝, その他.列車 );
			数値表示ペイン2を作成( この枝, その他.列車 );
			加速度指令ペインを作成( この枝, その他.列車 );
		};

		//

		let 数値表示ペイン1を作成 = function( 幹エレメント, 列車 )
		{
			let テーブル = 数値表示テーブルの型.作成( 幹エレメント, "VT1" );
			let 行 = テーブル.行を作成();
			行.項目を作成( "時速", 列車.時速, [ 0, "km/h" ] );
			//行.項目を作成( "秒速", 列車.時速, [ 0, "m/s", (v)=>v/3.6, (v)=>v*3.6 ] );
			行.項目を作成( "減衰加速度", 列車.減衰加速度, [ 1, "km/h/s" ] );
			行.項目を作成( "指令加速度", 列車.指令加速度, [ 1, "km/h/s" ] );
		};

		let 数値表示ペイン2を作成 = function( 幹エレメント, 列車 )
		{
			let テーブル = 数値表示テーブルの型.作成( 幹エレメント, "VT2" );
			let 行 = テーブル.行を作成();
			行.項目を作成( "秒速", 列車.時速, [ 1, "m/s", (v)=>v/3.6, (v)=>v*3.6 ] );
			行.項目を作成( "加速度", 列車.加速度, [ 1, "km/h/s" ] );
			行.項目を作成( "環境加速度", 列車.環境加速度, [ 1, "km/h/s" ] );
			行.項目を作成( "加速度減衰率", 列車.加速度減衰率, [ 1, "%", (v)=>v*100, (m)=>v/100 ] );
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

			この実体.項目を作成 = function( 表題, 値, 単位設定 )
			{
				return new 項目の型( 題行枝, 値行枝, 表題, 値, 単位設定 );
			};
		}

		let 項目の型 = function( 題行枝, 値行枝, 表題, 値, 単位設定 )
		{
			TDを作成( 題行枝, { クラス: "_TITLE", 文: 表題 } );
			let 値セル = TDを作成( 値行枝, { クラス: "_VCELL" } );
			let 値枝 = Spanを作成( 値セル, { クラス: "_VALUE" } );
			Spanを作成( 値セル, { クラス: "_UNIT", 文: 単位設定[ 1 ] } );

			let vtom = 単位設定[ 2 ] || ( (v)=>v );
			値.変更された( ()=> 値枝.文を設定( 少数を整理( vtom( 値.値 ), 単位設定[ 0 ] ) ) );
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
