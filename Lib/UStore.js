
const URON永続値型 = function()
{
	const この実体 = this;
	const 前外皮 = "#?", 後外皮 = "z";

	この実体.変更処理を登録 = ( 処理 ) =>
	{
		変更通知処理群[ ++ つぎの変更通知処理id ] = 処理;
		処理();
	};

	この実体.記憶 = () =>
	{
		URLに反映( true );
	};

	この実体.値を設定 = ( _値 ) =>
	{
		値 = _値;
		URLに反映( false );
		for( let id in 変更通知処理群 ) 変更通知処理群[ id ]();
	};

	この実体.値を取得 = () =>
	{
		return 値;
	};

	//  実装  //

	const 変更通知処理群 = {};
	let つぎの変更通知処理id = 0;
	let 値 = null;

	const 初期化 = () =>
	{
		window.addEventListener( "popstate", URLを取り込み );
		URLを取り込み();
	};

	const URLを取り込み = () =>
	{
		この実体.値を設定( URON.復元( location.hash, 前外皮 ) );
		console.log( JSON.stringify(値) );
	};

	const URLに反映 = ( プッシュ ) =>
	{
		const urlq = URON.変換( 値, 前外皮, 後外皮 );
		if( プッシュ )  history.pushState( null, null, urlq );
		else           history.replaceState( null, null, urlq );
	};

	初期化();
}
