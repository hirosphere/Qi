
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

	this.OnGMapInit = function()
	{
		this.GMapReady = true;
		console.log( "GMapReady" );
	};
};

function initMap()
{
	Main.OnGMapInit();
}

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
				let vert = new VertPane( this, { Width: 200, Rel: 10, Height: -1 } );

				{
					let horiz = new HorizPane( vert, { Width: -1, Height: 50, Rel: 10 } );

					var side = new SidePane( horiz, { Width: 150, Rel: 4, Height: -1,Doc: this.Doc } );
					var content = new PageSwitchPane
					(
						horiz, { Width: 150, Rel: 6, Height: -1, Doc: this.Doc, CssClass: "CONTENT_SWITCH" }
					);
				}
				
				{
					let horiz = new HorizPane( vert, { Width: -1, Height: 50 } );

					this.pathsel = new PathSelectPane
					(
						horiz, { Width: 100, Rel: 10, Height: -1, Class: "path", Selection: this.Doc.CurrentIndex }
					);

					this.CreateSaveTweet( horiz );
				}
			}

			this.Layout = new Layout.Horiz();

			let self = this;
			this.Doc.CurrentIndex.AddView( { Select: function( node ) {  self.UpdatePageTitle();  } } );
		};

		this.CreateSaveTweet = function( com )
		{
			let self = this;
			let horiz = new HorizPane( com, { Width: 180, Height: -1 } );
			new Pane( horiz, { Rel: 10 } );
			this.SaveButton = CreateButtonAnc( horiz, "確定", function() { self.CureHash(); } );
			this.TreetButton = CreateButtonAnc( horiz, "ツイート", function() { self.Tweet(); } );
		};

		function CreateButtonAnc( com, title, action )
		{
			let pane = new Pane( com, { Width: 90, Height: -1, edef: { type: "button", text: title } } );
			pane.e.onclick = action;
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
			let waveinfo = index && index.Type == "Wave" ? `${ rate }倍速` : "";
			let twtext = `${ index.LongCap }${ waveinfo } - 震These - 地震波形を「音」で聴くブラウザ画面アプリ。\n\n`;
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

			new CollListPane( this, { Width: -1, Height: 50, Rel: 10, Selection: args.Doc.CurrentIndex } );
			//new Pane( this, { Width: -1, Height: 50, edef: { type: "div", text: "side bottom" } } );

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
