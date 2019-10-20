
const URON永続値型 = function()
{
	const この実体 = this;
	const 前外皮 = "#?", 後外皮 = "z";
	let クエリー文字列 = "";

	この実体.値リスナーを登録 = ( リスナー ) =>
	{
		値リスナー群[ ++ 次のリスナーid ] = リスナー;
	};

	この実体.URLリスナーを登録 = ( リスナー ) =>
	{
		URLリスナー群[ ++ 次のリスナーid ] = リスナー;
	};

	この実体.URLを取り込み = ( 代替値 ) =>
	{
		const 新値 = URON.復元( location.hash, 前外皮 );
		この実体.値を設定( 新値 != undefined ? 新値 : 代替値, true );
		for( let id in URLリスナー群 ) URLリスナー群[ id ]( false );
		console.log( "URLを取り込み", location.hash );
	};

	この実体.URLに書き出し = ( プッシュ ) =>
	{
		if( プッシュ )
			history.pushState( null,  "" , クエリー文字列 );
		else
		{
			history.replaceState( null,  "" , クエリー文字列 );
			for( let id in URLリスナー群 ) URLリスナー群[ id ]( false );
		}
	};

	この実体.値を設定 = ( _値 ) =>
	{
		値 = _値;
		クエリー文字列 = URON.変換( 値, 前外皮, 後外皮 );
		for( let id in 値リスナー群 ) 値リスナー群[ id ]();
	};

	この実体.値を取得 = () =>
	{
		return 値;
	};

	//  実装  //

	const 値リスナー群 = {};
	const URLリスナー群 = {};
	let 次のリスナーid = 0;
	let 値 = null;

	window.addEventListener( "popstate", () => この実体.URLを取り込み() );
}
