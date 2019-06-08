
const 値セル群 = {};

値セル群.オブジェクトの型 = 型を作成
(
	//値セル群.基底の型,

	function( 基底のプロトタイプ )
	{
		const プロトタイプ = this;

		プロトタイプ.初期化 = function()
		{
			const これ = this;
			これ.要素 = {};
		};
		
		// 要素構築 //
		
		プロトタイプ.値フィールドを追加 = function( 要素名, 初期値, 省略値 )
		{
			const これ = this;
			const 要素 = 値セル群.実値の型.実体を作成( 初期値, 省略値 );
			これ.フィールドを追加( 要素名, 要素 )
		};
		
		プロトタイプ.フィールドを追加 = function( 要素名, 要素 )
		{
			const これ = this;
			これ.要素[ 要素名 ] = 要素;
		};


		// データ永続 //

		プロトタイプ.永続値を設定 = function( 値 )
		{
			const これ = this;

			for( let 名 in これ.要素 )
			{
				const 要素 = これ.要素[ 名 ].永続値を設定( 値 && 値[ 名 ] );
			}
		};

		プロトタイプ.永続値を取得 = function()
		{
			const これ = this;
			const 返り値 = {};
			
			for( let 名 in これ.要素 )
			{
				const 要素 = これ.要素[ 名 ];
				const 永続値 = 要素.永続値を取得();
				if( 永続値 !== undefined ) 返り値[ 名 ] = 永続値;
			}

			return Object.keys( 返り値 ).length ? 返り値 : undefined;
		};


		// データアクセス //

		プロトタイプ.値を設定 = function( 値 )
		{
			const これ = this;
			for( let 名 in　これ.要素 )  これ.要素[ 名 ].値を設定( 値[ 名 ] );
		};

		プロトタイプ.値を取得 = function()
		{
			const これ = this;
			const 返り値 = {};
			for( let 名 in　これ.要素 )
			{
				返り値[ 名 ] = これ.要素[ 名 ].値を取得();
			}
			return 返り値;
		};

		//  //

		プロトタイプ.toString = function()
		{
			return Object.keys( this.要素 );
		};
	}
);


値セル群.実値の型 = 型を作成
(
	function()
	{
		const プロトタイプ = this;

		プロトタイプ.初期化 = function( 省略値, 取得時の省略 )
		{
			const これ = this;
			これ.省略値 = 省略値;
			これ.取得時の省略 = 取得時の省略;
			これ.値を設定( 省略値 );
		};

		プロトタイプ.永続値を設定 = function( 値 )
		{
			const これ = this;
			これ._値 = ( 値 !== undefined ? 値 : これ.省略値 );
		};

		プロトタイプ.永続値を取得 = function()
		{
			const これ = this;
			return ( これ.取得時の省略 && これ._値 === これ.省略値 ) ? undefined : これ._値;
		};

		プロトタイプ.値 = function( 値 )
		{
			const これ = this;
			return arguments.length ? これ.値を設定( 値 ) : これ._値;
		};

		プロトタイプ.値を設定 = function( 値 )
		{
			const これ = this;
			これ._値 = 値;
			return これ._値;
		};

		プロトタイプ.値を取得 = function()
		{
			const これ = this;
			return これ._値;
		};

		//  //

		プロトタイプ.toString = function()
		{
			return "" + this._値;
		};
	}
);

