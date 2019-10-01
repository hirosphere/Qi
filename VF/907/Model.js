//  楽器  //

const モデル群 = new function()
{
	const この実体 = this;

	const 定義群 = {};

	定義群.EG型 =
	{
		
	};

	定義群.楽器型 =
	{
		員型定義: { Type: String, EG: "EG" },
		初期値: { Type: "FM", EG: [ 0, 30, 0, 20 ], Hireso: true }
	};





	const 型群を作成 = ( 群, 定義群 ) =>
	{
		for( let 名称 in 定義群 )
		{
			群[ 名称 ] = 型を作成( 定義群[ 名称 ] );
		}
	};

	const 型を作成 = ( 定義 ) =>
	{
		const 型 = function()
		{
			const この実体 = this;

			if( 定義.初期値 )
			{
				for( let 名称 in 定義.初期値 )  この実体[ 名称 ] = 定義.初期値[ 名称 ];
			}

			この実体.保存値を設定 = function()
			{
				;
			};

			この実体.保存値を取得 = function()
			{
				return 定義.初期値;
			};
		};

		return 型;
	};


	型群を作成( この実体, 定義群 );












	
	
	この実体.曲型 = function()
	{
		const この実体 = this;

		この実体.初期化 = function( 初期値 )
		{
			この実体.保存値を設定( 初期値 );
		};

		const 補完値 = { "Title": [ "", はい ], "Tempo": [ 120 ], "Key": [ 0 ] };
		
		この実体.保存値を設定 = function( 保存値 )
		{
			for( let 要素名 in 補完値 )
			{
				const 要素値 = 保存値 && 保存値[ 要素名 ];
				この実体[ 要素名 ] = ( 要素値 !== 未定義 ? 要素値 : 補完値[ 要素名 ] );
			}
		};

		この実体.保存値を取得 = function()
		{
		};
		
	};

};
