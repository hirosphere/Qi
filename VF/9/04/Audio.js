
let 音響群 = {};

let シンセの型 = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function( ドキュメント )
		{
			let この実体 = this;
			let 列車 = ドキュメント.列車;
			let 動力 = 列車.動力;

			//  パラメーター  //

			この実体.全音量 = 値の型.作成( 45 );
			この実体.モーター音量 = 値の型.作成( 35 );
			この実体.ファン音量 = 値の型.作成( 30 );
			この実体.歯車音量 = 値の型.作成( 30 );
			この実体.整流子音量 = 値の型.作成( 1 );

			//  導出値  //

			この実体.加速度音量 = 値の型.作成( 0 );

			
			//  音響要素を作成  //

			let 音響文脈 = 音響文脈の型.作成();
			let 全音量制幅器 = 音響文脈.ゲインを作成();
			全音量制幅器.接続( 音響文脈.出力() );

			let モーター周波数 = 音響文脈.固定値を作成( 0 );
			let モーター倍音周波数 = モーター周波数.後続を作成( 4 );
			let ファン周波数 = モーター周波数.後続を作成( 0 );
			let 噛み合い周波数 = モーター周波数.後続を作成( 0 );
			let 整流子周波数 = モーター周波数.後続を作成( 0 );

			let モーター = 音響群.純音発生器の型.作成( 音響文脈, 全音量制幅器, 0.4 );
			let ファン = 音響群.純音発生器の型.作成( 音響文脈, 全音量制幅器, 0.2 );
			let ギア = 音響群.純音発生器の型.作成( 音響文脈, 全音量制幅器, 0.2 );
			let ブラシ = 音響群.純音発生器の型.作成( 音響文脈, 全音量制幅器, 0.03 );

			モーター倍音周波数.接続( モーター.発振器.周波数() );
			噛み合い周波数.接続( ギア.発振器.周波数() );
			ファン周波数.接続( ファン.発振器.周波数() );
			整流子周波数.接続( ブラシ.発振器.周波数() );

			
			// 更新処理 //

			window.onclick = function() { 音響文脈.resume();  }

			function 更新処理1()
			{
				let 目標時刻 = 音響文脈.現在時刻() + 0.1;
				全音量制幅器.利得().その時へ直線変化( この実体.全音量.値 / 100, 目標時刻 );
				モーター.制幅器.振幅().その時へ直線変化( この実体.モーター音量.値 / 100, 目標時刻 );
				ファン.制幅器.振幅().その時へ直線変化( この実体.ファン音量.値 / 100, 目標時刻 );
				ブラシ.制幅器.振幅().その時へ直線変化( この実体.整流子音量.値 / 100, 目標時刻 );
				ギア音量の更新処理();
			}

			function 更新処理2()
			{
				モーター周波数.振幅().cancelAndHoldAtTime( 音響文脈.現在時刻() );
				モーター周波数.振幅().その時刻へ直線変化( 動力.モーター周波数.値, 音響文脈.現在時刻() );
				モーター倍音周波数.振幅().値( 4 );
				噛み合い周波数.振幅().値( 動力.駆動歯数.値 );
				ファン周波数.振幅().値( 動力.冷却ファン羽数.値 );
				整流子周波数.振幅().値( 動力.整流子数.値 );
				console.log(  );
			}

			function 速度の更新処理()
			{
				let 目標時刻 = 音響文脈.現在時刻() + ドキュメント.コマ秒;
				//モーター周波数.振幅().その時刻へ直線変化( 動力.モーター周波数.値, 音響文脈.現在時刻() );
				モーター周波数.振幅().その時刻へ直線変化( 動力.モーター周波数.値, 目標時刻 );
			}

			function ギア音量の更新処理()
			{
				let 目標時刻 = 音響文脈.現在時刻() + 1 / 100;
				let x = Math.pow( 10, 4 );
				let accv = この実体.加速度音量.値を設定
				(
					Math.log( 1 + x * Math.abs( 列車.調整指令加速度.値 ) ) /
					Math.log( 1 + x * 10 )
				);

				ギア.制幅器.振幅().その時刻へ直線変化( この実体.歯車音量.値 / 100 * accv, 目標時刻 );
			}

			この実体.全音量.変更処理を追加( 更新処理1 );
			この実体.モーター音量.変更処理を追加( 更新処理1 );
			この実体.ファン音量.変更処理を追加( 更新処理1 );
			この実体.整流子音量.変更処理を追加( 更新処理1 );
			この実体.歯車音量.変更処理を追加( ギア音量の更新処理 );

			動力.車輪径.変更処理を登録( 更新処理2 );
			動力.駆動歯数.変更処理を登録( 更新処理2 );
			動力.被動歯数.変更処理を登録( 更新処理2 );
			動力.冷却ファン羽数.変更処理を登録( 更新処理2 );
			動力.整流子数.変更処理を登録( 更新処理2 );

			列車.時速.変更処理を追加( 速度の更新処理 );
			列車.調整指令加速度.変更処理を追加( ギア音量の更新処理 );

			更新処理1();
			更新処理2();
			ギア音量の更新処理();
			速度の更新処理();

		};

		この型.更新 = function()
		{
			let この実体 = this;
		};

		この型.ノート処理 = function( チャンネル, 開始 )
		{
			let この実体 = this;
		};
	}
);

音響群.純音発生器の型 = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function( 音響文脈, 出力先, 音量 )
		{
			let この実体 = this;
			この実体.音響文脈 = 音響文脈;

			//  要素を作成  //

			この実体.発振器 = 音響文脈.オシレーターを作成();
			この実体.制幅器 = 音響文脈.ゲインを作成();
			;

			//  値の設定  //

			この実体.制幅器.利得().値( 音量 );
			//この実体.発振器.type = "square";
			この実体.発振器.周波数().値( 0 );
			;

			//  接続  //
			
			この実体.発振器.接続( この実体.制幅器 );
			この実体.制幅器.接続( 出力先 );
			;

			let いま = 音響文脈.現在時刻();
			この実体.発振器.開始( いま + 0 );

		};

		この典型.周波数を設定 = function( 周波数, その時刻 )
		{
			let この実体 = this;
			この実体.発振器.周波数().その時刻へ直線変化( 周波数, その時刻 );
			//この実体.発振器.周波数().値( 周波数 );
		};
	}
);

音響群.モーターファン = function( 文脈, 出力 )
{
	;
};

音響群.歯車 = function( 文脈, 出力 )
{
	;
};

音響群.モーター制御 = function( 文脈, 出力 )
{
	;
};

音響群.車輪 = function( 文脈, 出力 )
{
	;
};

音響群.シーケンサー = 型を作成
(
	function()
	{
		let この典型 = this;

		この典型.開始する = function()
		{
			;
		};
	}
);


