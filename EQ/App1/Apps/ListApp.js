
let Main = new function()
{
	this.Init = function()
	{
		let self = this;
		let root = new RootPane();
		let appPane = new AppPane( root );
		root.UpdateLayout();

		EQFS.Init( eqfscomplete );

		function eqfscomplete()
		{
			appPane.Initialize();
			self.AppReady = true;
			console.log( "AppReady" );
		};

		window.addEventListener( "hashchange", function() { appPane.SetHash( location.hash ); } ,  false );
	};
};

let AppPane = class_def
(
	Pane,
	function( base )
	{
		this.Type = "AppPane";
		this.Initiate = function()
		{
			base.Initiate.apply( this, arguments );
		};
		
		this.Build = function()
		{
			this.Doc = new Doc();

			this.e = q.div( null, { "class": "APP" } );

			{
				let vert = new VertPane( this, { Width: 200, Rel: 1, Height: -1 } );
				
				{
					let horiz = new HorizPane( vert, { Width: -1, Height: 40 } );
					
					this.pathsel = new PathSelectPane
					(
						horiz, { Width: 250, Rel: 1, Height: -1, Class: "path", Selection: this.Doc.CurrentIndex }
					);

					this.CreateSaveTweet( horiz );
				}

				{
					let horiz = new HorizPane( vert, { Width: -1, Height: 50, Rel: 10 } );

					let side = new SidePane( horiz, { Width: 200, Rel: 0.3, Height: -1,Doc: this.Doc } );
					let content = new PageSwitchPane
					(
						horiz, { Width: 150, Rel: 7, Height: -1, Doc: this.Doc, CssClass: "CONTENT_SWITCH" }
					);
				}
			}

			this.Layout = new Layout.Horiz();

			let self = this;
			this.Doc.CurrentIndex.AddView( { Select: function( node ) {  self.UpdatePageTitle();  } } );
		};

		this.CreateSaveTweet = function( com )
		{
			let self = this;
			let horiz = new HorizPane( com, { Width: 270, Height: -1 } );
			new Pane( horiz, { Rel: 10 } );
			this.SaveButton = CreateButtonAnc( horiz, "URL確定", function() { self.CureHash(); } );
			this.TreetButton = CreateButtonAnc( horiz, "ツイート", function() { self.Tweet(); } );
			// CreateSelect( horiz, [ [ "6" ], [ "7" ], [ "8" ], [ "9" ] ] )
		};

		function CreateButtonAnc( com, title, action )
		{
			let pane = new Pane( com, { Width: 90, Height: -1, edef: { type: "button", text: title } } );
			pane.e.onclick = action;
			return pane;
		}

		function CreateSelect( com, list )
		{
			let pane = new Pane( com, { Width: 90, Height: -1, edef: { type: "select" } } );
			for( let item of list )
			{
				q.option( pane.e, { text: item[ 0 ] } );
			}
			//pane.e.onclick = action;
			return pane;
		}

		this.Initialize = function()
		{
			location.hash ?
				this.Doc.SetHash( location.hash ) :
				this.Doc.CurrentIndex.Set( this.Doc.RootIndex );
			
			this.Doc.Modified.Set( false );
		};

		this.UpdatePageTitle = function()
		{
			let cur = this.Doc.CurrentIndex.Get();
			document.title = ( cur && cur.GetCaption() + " - " ) + "地震波形を聴く";
		};

		this.Tweet = function()
		{
			let url = location.origin + location.pathname + this.Doc.GetHash();
			let index = this.Doc.CurrentIndex.Get();

			let rate = this.Doc.AudioPlayer.Rate.GetValue();
			let waveinfo = index && index.Type == "Wave" ? ` ${ rate }倍速` : "";
			let twtext = `${ index.LongCap }${ waveinfo } - 地震波形を耳で解析。\n\n`;
			window.open
			(
				"http://twitter.com/intent/tweet?" +
				"url=" + encodeURIComponent( url ) +
				"&text=" + encodeURIComponent( twtext )
			);

			this.CureHash();
		};

		this.SetHash = function( hash )
		{
			this.Doc.SetHash( hash );
		};

		this.CureHash = function()
		{
			location.hash = this.Doc.GetHash();
		};

	}
);

let SidePane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": "side", text_: "side" } );

			//new PathSelectPaneB( this, { Width: -1, Height: 50, Rel: 0, Selection: args.Doc.CurrentIndex } );
			//let map = new MapPane( this, { Width: -1, Height: 50, Rel: 90 } );
			let list = new CollListPane( this, { Width: -1, Height: 50, Rel: 100, Selection: args.Doc.CurrentIndex } );
			//let list2 = new CollListPane( this, { Width: -1, Height: 200, Rel: 0, Selection: args.Doc.CurrentIndex } );

			//list.Test = true;
			this.Layout = new Layout.Vert();
		};
	}
);

let BarPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			;
		};
	}
);
