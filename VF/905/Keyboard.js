const 鍵盤の型 = function( 幹, 設定 )
{
	const 鍵幅 = 50;
	const 鍵長 = 160;
	const 黒鍵比 = 0.55;
	const 黒鍵長 = 鍵長 * 黒鍵比;

	const 主枝 = Divを作成
	(
		幹,
		{
			スタイル:
			{
				position: "relative",
				height: 鍵長 + "px"
			}
		}
	);

	const 鍵データリスト =
	[
		// 位置, キー, 黒鍵ずれ //
		[ 0, 0 ],
		[ 0, 1, - 1 ],
		[ 1, 2 ],
		[ 1, 3, + 0 ],
		[ 2, 4 ],
		[ 3, 5 ],
		[ 3, 6, - 1 ],
		[ 4, 7 ],
		[ 4, 8, 0 ],
		[ 5, 9 ],
		[ 5, 10, + 1 ],
		[ 6, 11 ],
	];

	const 白鍵数 = 7;

	for( let i = 0, 左位置 = 0; i < 61; i ++ )
	{
		const オクターブ = Math.floor( i / 鍵データリスト.length );
		const 鍵位相 = i % 鍵データリスト.length;

		const 鍵データ = 鍵データリスト[ 鍵位相 ];
		const キー = 鍵データ[ 1 ] + オクターブ * 12;
		const 黒鍵ずれ = 鍵データ[ 2 ];

		左位置 = キーを作成( 主枝, 左位置, キー, 黒鍵ずれ,  );
	}

	const イベント処理 = 設定.イベント処理 || ( () => {} );
	let チャンネル = 設定.チャンネル || 0;

	function キーを作成( 幹, 左位置, キー, 黒鍵ずれ )
	{
		const 黒鍵か = 黒鍵ずれ !== undefined;
		let _チャンネル;
		let _キー;

		const 主枝 = Divを作成
		(
			幹,
			{
				クラス: 黒鍵か ? "KB_IB" : "KB_II",
				スタイル: { left: 左位置 + "px" }
			}
		);

		黒鍵か && Divを作成
		(
			主枝,
			{
				
			}
		);

		主枝.マウスとタッチ処理を追加
		(
			ev =>		// 開始処理 //
			{
				ev.preventDefault();
				ev.stopPropagation();
				イベント処理( { 種類: "打鍵", チャンネル: チャンネル, キー: キー } );
			},
			null,
			ev =>		// 終了処理 //
			{
				ev.preventDefault();
				ev.stopPropagation();
				イベント処理( { 種類: "離鍵", チャンネル: チャンネル, キー: キー } );
			}
		);

		return 黒鍵か ? 左位置 : 左位置 + ( 主枝.offsetWidth - 0 );
	}

};







