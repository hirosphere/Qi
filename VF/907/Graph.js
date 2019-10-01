const グラフ型 = 型を作成
(
	function()
	{
		const この典型 = this;

		この典型.初期化 = function( 幹, 設定 )
		{
			const この実体 = this;
			この実体.キャンバス = Canvasを作成( 幹 );
			この実体.文脈 = この実体.キャンバス.getContext( "2d" );
			この実体.設定を設定( 設定 );
		};

		この典型.設定を設定 = function( 設定 )
		{
			const この実体 = this;

			この実体.設定 =
			{
				背景色: "hsl( 210, 30%, 95% )",
				幅: 300,
				高さ: 200
			};

			if( 設定 ) for( let n in 設定 ) この実体.設定[ n ] = 設定[ n ];
			console.log( この実体.設定.背景色 );
			この実体.設定を反映();
		};

		この典型.設定を反映 = function()
		{
			const この実体 = this;

			この実体.キャンバス.width = この実体.設定.幅;
			この実体.キャンバス.height = この実体.設定.高さ;
			この実体.文脈.fillStyle = この実体.設定.背景色;
			console.log( この実体.文脈.fillStyle, この実体.キャンバス.width, この実体.キャンバス.height );
			この実体.文脈.fillRect( 0, 0, この実体.キャンバス.width, この実体.キャンバス.height );
		};

	}
);

const 波形レイヤー型 = 型を作成
(
	function()
	{
		const この典型 = this;

		この典型.初期化 = function( 設定 )
		{
			const この実体 = this;
			この実体.設定を設定( 設定 );
		};
		
		この典型.描画 = function( グラフ )
		{
			const この実体 = this;
		};

		この典型.設定を設定 = function( 設定 )
		{
			const この実体 = this;

			const data = [];

			for( let i = 0; i < 256; i ++ ) data[ i ] = Math.sin( i / 256 * Math.PI * 2 );

			この実体.データ = data;

			この実体.設定 =
			{
			};

			if( 設定 ) for( let n in 設定 ) この実体.設定[ n ] = 設定[ n ];
		};
	}
);
