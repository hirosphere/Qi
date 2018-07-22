
let Main = new function()
{
	this.Init = async function()
	{
		const app = new AppPane( document.body, new Doc() );
		await EQFS.Init();
		app.Init();
	};

	this.OnMapInit = function()
	{
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

			let vert = q.div( null, { "class": "APP" } );

			new PathPane( this, vert );
			let content = q.div( vert, { "class": "APP_CONTENT"} );
			this.Content = new PageSwitch( content );
			this.Content.Add( new RootPage( this.Doc.CurrentIndex ), "Root" );
			this.Content.Add( new YearPage( this.Doc.CurrentIndex ), "Year" );
			this.Content.Add( new EQPage( this.Doc.CurrentIndex ), "EQ" );
			this.Content.Add( new FolderPage( this.Doc.CurrentIndex ), "Folder" );
			this.Content.Add( new WavePage( this ), "Wave" );
			//...this.Content.Select( "Root", this.Doc.RootIndex );

			this.Info = q.div( vert, { text: "Info", "class": "APP_INFO" } );

			com && com.appendChild( vert );
			//...this.SelectIndex( this.Doc.RootIndex );

			let self = this;

			this.Doc.CurrentIndex.AddView( function() { self.OnCurrentIndexChange(); }, true );
			window.addEventListener( "hashchange", function() { Hash.Load( self.Doc ); } , false );
		};

		this.Init = function()
		{
			Hash.Load( this.Doc );
		};

		// ページ要素 //

		let PathPane = function( app, com )	// ナビケーション:パス //
		{
			let e = q.div( com, { "class": "APP_PATH" } );
		
			app.PathList = new PathList( e, "PATH_LIST", app.Doc.CurrentIndex );
		
			let r = q.horiz( e, { "class": "APP_PATH_PAD" } );
			q.button( e, { text: "反映" } ).onclick = function() { Hash.Save( app.Doc ); };
			q.button( e, { text: "ツイート" } ).onclick = function() { app.Tweet(); };
		};
		
		// オペレーション //

		this.OnCurrentIndexChange = async function()
		{
			let index = this.Doc.CurrentIndex.Get();
			this.UpdateTitlebar( index );
			await this.PathList.SetIndex( index );
			index && this.Content.Select( index.Type, index );

			q.text( this.Info, index && index.FilePath );
		};

		this.Tweet = function()
		{
			Hash.Save( this.Doc );
			let index = this.Doc.CurrentIndex.Get();
			window.open
			(
				"http://twitter.com/intent/tweet?" +
				"url=" + encodeURIComponent( location.href ) +
				"&text=" + encodeURIComponent( Cu.Tweet( index ) )
			);
		};

		// イベント応答  //

		// ページ //

		// タイトルバー //

		this.UpdateTitlebar = function( index )
		{
			document.title = Cu.Index.Cap( index ) + " - 震・These";
		};

		//  //
		
	}
);
