//  //

const シーケンサーの型 = function( 文脈, 複楽器 )
{
	const これ = this;

	let 開始時刻;	//  秒
	let 時刻 = 0;	//  秒

	let 間欠番号;
	let 音符カウンタ = 0;

	const コマ時間sec = 0.5;
	let テンポ = 120;
	let シーケンス = [ [ 64, 24 ], [ 60, 24 ] ];


	// 操作 //
	
	this.開始 = function()
	{
		文脈.再開();
		console.log( "シーケンサー", "開始", 文脈.状態() );
		開始時刻 = 文脈.現在時刻();
		間欠番号 = 間欠を設定( ()=>this.コマ処理( 0.5 ), 500 );
	};
	
	this.停止 = function()
	{
		文脈.再開();
		console.log( "シーケンサー", "停止", 文脈.状態() );
		if( 間欠番号 ) 間欠番号 = 間欠を解除( 間欠番号 );
	};
	
	this.一時停止 = function()
	{
		;
	};

	//  //

	this.コマ処理 = function( コマ秒 )
	{
		const 全音符秒 = ( 1 / ( テンポ / 120 ) ) * 2;
		const コマクロック = ( コマ秒 / 全音符秒 ) * 192;

		console.log( 小数を整理( 文脈.現在時刻(), 2 ), 全音符秒, 小数を整理( コマクロック, 2 ) );
	}
};

const 複楽器の型 = function( 文脈, 出力先, 楽器群 )
{
	const これ = this;

	this.出力 = 文脈.ゲインを作成();
	this.出力.振幅().値( 0 );
	this.出力.接続( 出力先 );

	this.前出力 = 文脈.ゲインを作成();
	this.前出力.振幅().値( 1 );
	this.前出力.接続( this.出力 );

	for( let i in 楽器群 )  楽器群[ i ].出力.接続( this.前出力 );

	// サスペンド防止用音叉 //

	this.音叉 = new function()
	{
		this.オシレーター = 文脈.オシレーターを作成();
		this.ゲイン = 文脈.ゲインを作成( 0 );

		this.オシレーター.周波数().値( 1 / 20 );
		this.ゲイン.振幅().値( 0.01 );

		this.オシレーター.接続( this.ゲイン );
		this.オシレーター.開始();
		this.ゲイン.接続( これ.前出力 );
	};

	// メソッド //

	this.予定を投函 = function( 予定 )
	{
		const 楽器 = 楽器群[ 予定.チャンネル ];
		if( 楽器 )
		{
			楽器.予定を投函( 予定 );
		}
	};

	this.音量を設定 = function( 値 )
	{
		this.出力.振幅().直線を設定( 値 / 100, 文脈.現在時刻() + 0.01 );
		//this.出力.振幅().値( this.音量 );
	};
}

const 単楽器の型 = function( 文脈, 声数, モデル )
{
	const 声群 = [];
	const 出力 = this.出力 = 文脈.ゲインを作成();

	let 次の声番 = 0;
	
	//
	this.予定を投函 = function( 予定 )
	{
		if( 文脈.状態() == "suspended" )
		{
			文脈.再開();
			console.log( 文脈.状態() );
			return;
		}

		switch( 予定.種類 )
		{
			case "打鍵":
			{	
				const 波形 = new 波形の型( モデル.要素.波形.値(), 文脈 );
				const 単声 = 声群[ 予定.打鍵Id ] = new 単声の型( 文脈, モデル, 出力, 0.2, 波形 );
				単声.打鍵( 予定 );

				break;
			}

			case "離鍵":
			{
				const 単声 = 声群[ 予定.打鍵Id ];
				単声 && 単声.離鍵( 予定 );
				delete 声群[ 予定.打鍵Id ];
				break;
			}
		}
	};

	this.保存値を設定 = function( 値 )
	{
	};

	this.保存値を取得 = function()
	{
		;
	};

	let t = 文脈.現在時刻();

};

function 波形の型( 設定値, 文脈 )
{
	const これ = this;
	const 波形名テーブル = { "sin": "sine", "tri": "triangle", "squ": "square", "saw": "sawtooth" };

	if( 設定値 == null )  これ.波形名 = "sine";

	else if( 設定値.constructor == String )
	{
		これ.波形名 = 波形名テーブル[ 設定値.toLowerCase() ] || "sine";
	}

	else if( 設定値.constructor == Array )
	{
		const テーブル = new 倍音テーブルの型( 設定値 );
		これ.倍音構成 = 文脈.倍音構成を作成( テーブル.Real, テーブル.Imag );
	}

	else これ.波形名 = "sine";

	this.オシレーターに設定 = function( オシレーター )
	{
		if( これ.倍音構成 ) オシレーター.倍音構成を与える( これ.倍音構成 );

		else オシレーター.波形( これ.波形名 );
	}
}

function 倍音テーブルの型( 設定 )
{
	const これ = this;
	これ.Imag = new Float32Array( 128 );
	これ.Real = new Float32Array( 128 );

	if( 設定.constructor == String )
	{
		const 構成 = 設定.split( /\/|'/g );
		const 音量 = ( 構成[ 1 ] || 0 ) / 100;
		const 逓倍 = 構成[ 2 ] || 1;
		const 減衰 = 構成[ 3 ] || 0;
		const 次数 = 構成[ 4 ] || 128;

		for( let i = 1; i <= Math.min( 逓倍 * 次数, これ.Real.length - 1 ); i ++ )
		{
			これ.Imag[ i * 逓倍 ] = 音量 * 1 / Math.pow( i, 減衰 );
		}
	}

	else　if( 設定 && 設定.constructor == Array )
	{
		const 要素群 = [];

		for( let i in 設定 )
		{
			const 要素 = new 倍音テーブルの型( 設定[ i ] );

			for( let i in これ.Imag )  これ.Imag[ i ] += 要素.Imag[ i ];
		}
	}
}

const 単声の型 = function( 文脈, モデル, 出力先, 音量, 波形 )
{
	const Mo = モデル.要素;
	const EG = モデル.要素.EG1.要素;

	const オシレーター1 = 文脈.オシレーターを作成();
	const 音程ノード = 文脈.値ゲインを作成( 0 );
	const エンベロープゲイン = 文脈.値ゲインを作成( 0 );
	const 出力ゲイン = 文脈.ゲインを作成();
	const 出力 = 出力ゲイン;

	オシレーター1.周波数().値( 440 );
	波形.オシレーターに設定( オシレーター1 );
	出力ゲイン.振幅().値( 0 );

	オシレーター1.接続( 出力ゲイン );
	エンベロープゲイン.接続( 出力ゲイン.振幅() );
	出力ゲイン.接続( 出力先 );
	
	オシレーター1.開始();

	this.打鍵 = function( 予定 )
	{
		const t = 文脈.現在時刻() + 0.003;
		オシレーター1.ピッチ().その時刻の値( ( 予定.キー - 69 + Mo.移調.値() ) * 100, t );
		音程ノード.オフセット().その時刻の値( ( 予定.キー - 69 + Mo.移調.値() ) * 100, t );

		
		const a = t + EG.A.値() / 1000;
		const d = a + EG.D.値() / 1000;
		
		エンベロープゲイン.振幅().その時刻の値( 0, t );
		//エンベロープゲイン.振幅().直線を設定( 音量, t + EG.A.値() / 1000 / 1 );
		エンベロープゲイン.振幅().充放電を設定( 音量 / 0.63, t, EG.A.値() / 1000 / 1 );
		エンベロープゲイン.振幅().setTargetAtTime( 音量 * EG.S.値() / 100, a, EG.D.値() / 1000 / 1 );
	};

	this.離鍵 = function( 予定 )
	{
		const t = 文脈.現在時刻() + 0;
		const rlen = EG.R.値() / 1000;
		const rlen_exp = rlen * 0.9;
		const rpt_lin = t + rlen_exp;
		
		エンベロープゲイン.振幅().予定を破棄( t );
		エンベロープゲイン.振幅().充放電を設定( 0, t, rlen );
		//エンベロープゲイン.振幅().setTargetAtTime( 0, , rpt_lin );

		時限を設定( 後始末, EG.R.値() * 10 );
	};

	function 後始末()
	{
		オシレーター1.終了();

		オシレーター1.切断();
		エンベロープゲイン.切断();
		出力.切断();
	}
};

