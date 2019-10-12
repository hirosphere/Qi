
const アプリケーション型 = function( 幹 )
{
	const この実体 = this;
	const 枝 = Divを作成( 幹 );

	//const doc1 = new モデル群.楽器型();
	//const data = doc1.保存値を取得();

	const value = { Type: "G1", "Title":"HSLカラー", Color: [ 120, 50, 90 ], Width: 500, Height: 200 };
	const 永続値 = new URON永続値型();
	if( 永続値.値を取得() == null ) 永続値.値を設定( value );

	new アプリケーションフレーム型( 枝, 永続値 );
	new JSON編集型( 枝, 永続値 );
	
	{
		//const div = Divを作成( 枝, {} );
		//new グラフ型( div, { 幅: 500, 高さ: 300, 背景色: "hsl( 210, 77%, 84% )" } );
	}
};

const JSON編集型 = function( 幹, 永続値 )
{
	const この実体 = this;

	const div = Divを作成( 幹, {} );
	const es = {};
	
	es.json1 = Textareaを作成( div, { スタイル: { width: "700px", height: "50px", display: "block" } } );
	
	Buttonを作成( div, { 文: "記憶", 属性: { onclick: () => 永続値.記憶() } } );

	es.uron = Textareaを作成( div, { クラス: "Monitor", スタイル: { width: "700px", height: "50px" } } );
	es.link = Textareaを作成( div, { クラス: "Monitor", スタイル: { width: "700px", height: "50px" } } );
	es.json2 = Textareaを作成( div, { クラス: "Monitor", スタイル: { width: "700px", height: "50px" } } );
	es.json3 = Textareaを作成( div, { クラス: "Monitor", スタイル: { width: "700px", height: "50px" } } );
	es.mon1 = Textareaを作成( div, { クラス: "Monitor", スタイル: { width: "700px", height: "100px" } } );
	
	{
		const con = Pを作成( div );
		es.a = Aを作成( con, { 文: "別ページで開く", 属性: { target: "_blank" } } );
	}

	const 永続値を反映 = () =>
	{
		es.json1.value = JSON.stringify( 永続値.値を取得() );
		モニタを更新();
	};
	
	const 編集内容を永続値に設定 = () =>
	{
		try
		{
			永続値.値を設定( JSON.parse( es.json1.value ) );
		}
		catch {}
	};
	
	const モニタを更新 = () =>
	{
		const hash = URON.変換( 永続値.値を取得(), "#?", "z" );
		es.uron.value = hash;
		es.link.value = "https://hirosphere.github.io/Qi/VF/" + hash;
		es.json2.value = URON.JSONに復元( hash, "#?" );
		es.json3.value = JSON.stringify( URON.復元( hash, "#?" ) );
		es.a.href = hash;
		es.mon1.value = URON.モニタ.a;
	};

	es.json1.onkeydown = ( ev ) =>
	{
		if( ev.keyCode == 13 ) {  編集内容を永続値に設定() ; return false; }
	};

	永続値.変更処理を登録( 永続値を反映 );
};

const アプリケーションフレーム型 = function( 幹, 永続値 )
{
	const この実体 = this;

	const アプリプール = {};
	let 表示中のアプリ = null;

	const 枝 = Divを作成( 幹, { クラス: "AppFrame" } );

	この実体.保存値を設定 = ( 保存値 ) =>
	{
		const type = 保存値 && 保存値.Type && 保存値.Type || "G1";
		const 型 = アプリ型群[ type ] || アプリ型群[ "G1" ];
		const アプリ = アプリプール[ type ] = アプリプール[ type ] || new 型( 枝 );

		if( アプリ != 表示中のアプリ )
		{
			if( 表示中のアプリ )  表示中のアプリ.表示を設定( false );
			表示中のアプリ = アプリ;
			if( 表示中のアプリ )  表示中のアプリ.表示を設定( true );
		}

		表示中のアプリ.保存値を設定( 保存値 );
		document.title = 表示中のアプリ.タイトルを取得();
	};

	この実体.保存値を取得 = () =>
	{
		return 表示中のアプリ.保存値を取得();
	};

	永続値.変更処理を登録( () => この実体.保存値を設定( 永続値.値を取得() ) );
	
};

const アプリ型群 = {}

アプリ型群.G1 = function( 幹 )
{
	const この実体 = this;

	const 枝 = Divを作成( 幹, {  } );
	const タイトル = Pを作成( 枝, { 文: "タイトル" } );
	const 表示 = Divを作成( 枝, { スタイル: { width: "40px", height: "40px", background: "hsl( 90, 50%, 60% )" } } );

	const 初期値 =
	{
		Type: "G1",
		Title: null,
		Color: [ 90, 80, 80 ]
	};

	let 属性 = null;

	この実体.タイトルを取得 = () => ( 属性 && 属性.Title != null ? 属性.Title : "G1" );

	この実体.表示を設定 = ( 値 ) => 枝.style.display = ( 値 ? "block" : "none" );

	この実体.保存値を設定 = ( 保存値 ) =>
	{
		属性 = 組を複製( 属性, 初期値 );
		属性 = 組を複製( 属性, 保存値 );
		更新();
	};

	この実体.保存値を取得 = () =>
	{
		return 属性;
	};

	const 更新 = () =>
	{
		タイトル.文を設定( 属性.Title != null ? 属性.Title : "" );
		表示.style.background = HTML色値に変換( 属性.Color );
		表示.style.width = 属性.Width + "px";
		表示.style.height = 属性.Height + "px";
	};
};

const 組を複製 = ( 先, 元 ) =>
{
	先 = 先 || {};
	if( 元 )  for( let 名 in 元 )  先[ 名 ] = 元[ 名 ];
	return 先;
};

const HTML色値に変換 = ( value ) =>
{
	return `hsl( ${ value[ 0 ] }, ${ value[ 1 ] }%, ${ value[ 2 ] }% )`;
};
