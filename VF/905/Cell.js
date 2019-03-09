
const 値セル群 = {};

値セル群.オブジェクトの型 = 型を作成
(
	function()
	{
		const プロトタイプ = this;

		プロトタイプ.初期化 = function()
		{
			const これ = this;
			
			これ.要素 = {};
			これ.ハッシュリスト = {};
		};

		// 要素構築 //
		
		プロトタイプ.値フィールドを追加 = function( 要素名, ハッシュ名, 省略値, 省略不可 )
		{
			const これ = this;
			const 要素 = 値セル群.実値の型.実体を作成( 省略値, 省略不可 );
			これ.フィールドを追加( 要素名, ハッシュ名, 要素 )
		};
		
		プロトタイプ.フィールドを追加 = function( 名, ハッシュ名, アイテム )
		{
			const これ = this;
			これ.要素[ 名 ] = アイテム;
			if( ハッシュ名 != null ) これ.ハッシュリスト[ ハッシュ名 ] = アイテム;
		};

		// データアクセス //

		プロトタイプ.値を与える = function( 値 )
		{
			const これ = this;
			for( let 名 in　これ.要素 )  これ.要素[ 名 ].値を与える( 値 && 値[ 名 ] );
		};

		プロトタイプ.値を得る = function()
		{
			const これ = this;
			const 返り値 = {};
			for( let 名 in　これ.要素 )  返り値[ 名 ] = これ.要素[ 名 ].値を得る();
			return 返り値;
		};


		// データ永続 //

		プロトタイプ.ハッシュを与える = function( ハッシュ )
		{
			const これ = this;
			これ.永続値を与える( URLハッシュ.復元( ハッシュ ) );
		};

		プロトタイプ.ハッシュを得る = function( ハッシュ )
		{
			const これ = this;
			return URLハッシュ.変換( これ.永続値を得る() );
		};

		プロトタイプ.永続値を与える = function( 値 )
		{
			const これ = this;

			for( let 名 in これ.ハッシュリスト )
			{
				const 要素 = これ.ハッシュリスト[ 名 ];
				要素.永続値を与える( 値 && 値[ 名 ] );
			}
		};

		プロトタイプ.永続値を得る = function()
		{
			const これ = this;
			const 返り値 = {};
			
			for( let 名 in これ.ハッシュリスト )
			{
				const 要素 = これ.ハッシュリスト[ 名 ];
				const 永続値 = 要素.永続値を得る();
				if( 永続値 !== undefined ) 返り値[ 名 ] = 永続値;
			}

			return Object.keys( 返り値 ).length ? 返り値 : undefined;
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

		プロトタイプ.初期化 = function( 省略値, 省略不可 )
		{
			const これ = this;
			これ._値 = これ.省略値 = 省略値;
			これ.省略不可 = 省略不可;
		};

		プロトタイプ.値 = function( 値 )
		{
			const これ = this;
			return arguments.length ? これ.値を与える( 値 ) : これ._値;
		};

		プロトタイプ.値を与える = function( 値 )
		{
			const これ = this;
			これ._値 = ( 値 !== undefined ? 値 : これ.省略値 );
			return これ._値;
		};

		プロトタイプ.値を得る = function( 値 )
		{
			const これ = this;
			return これ._値;
		};

		プロトタイプ.永続値を与える = function( 値 )
		{
			const これ = this;
			これ._値 = ( 値 !== undefined ? 値 : これ.省略値 );
		};

		プロトタイプ.永続値を得る = function()
		{
			const これ = this;
			return ( これ._値 !== これ.省略値 || これ.省略不可 ) ? これ._値 : undefined;
		};

		//  //

		プロトタイプ.toString = function()
		{
			return "" + this._値;
		};
	}
);

値セル群.数値の型 = 拡張型を作成
(
	値セル群.実値の型,
	function( 基底プロトタイプ )
	{
		const プロトタイプ = this;

		プロトタイプ.初期化 = function( 初期値 )
		{
			基底プロトタイプ.初期化.call( this );
		}
	}
)
