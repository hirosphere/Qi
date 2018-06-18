
let Main = new function()
{
	this.Init = function()
	{
		const app = new AppPane( document.body, new Doc() );
		EQFS.Initialize();
		app.Initialize();
	};

	this.OnMapInit = function()
	{
		console.log( "MapInit" );
	};
};

function initMap() { Main.OnMapInit(); }

let AppPane = class_def
(
	null,
	function( base )
	{
		this.Initiate = function( com, doc )
		{
			this.Doc = doc;

			let vert = q.vert( null, { "class": "App" } );

			new PathPane( vert, this );
			let content = q.horiz( vert, { "class": "Content"} );
			this.Content = new PageSwitch( content );
			this.Content.Add( new RootPage(), "Root" );
			this.Content.Add( new WavePage(), "Wave" );
			this.Content.Select( "Root" )

			com && com.appendChild( vert );
			this.SelectIndex( this.Doc.RootIndex );
		};

		this.Initialize = function()
		{
			this.Doc.ImportHash();
		};

		// オペレーション //

		this.SelectIndex = function( index )
		{
			this.UpdateTitlebar( index );
		};

		// イベント応答  //

		// ページ //

		// タイトルバー //

		this.UpdateTitlebar = function( index )
		{
			document.title = Cu.Index.Caption.Get( index ) + " - 震・These";
		};

		//  //
		
	}
);

let SidePane = function( com )	
{
	let e = q.div( null, { "class": "Side" } );
	q.div( e, { text: "Side" } ) ;

	com.appendChild( e );
};

let PathPane = function( com, app )	// ナビケーション:パス //
{
	let e = q.horiz( null, { "class": "Path" } );
	q.div( e, { text: "Path" } ) ;

	let rdiv = q.horiz( e, { "class": "RDiv" } );
	q.anc( e, { text: "Wave", attrs: { href: "#EQ=2016/04/20/2119&Wave=IBRH11s" }, style: { padding: "0 1em" } } );
	q.button( e, { text: "反映" } ).onclick = function() { app.Doc.ExportHash(); };
	q.button( e, { text: "ツイート" } );
	com.appendChild( e );
};
