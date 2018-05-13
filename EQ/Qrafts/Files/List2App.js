let Main = new function()
{
	this.Init = function()
	{
		let root = new RootPane();
		this.AppPane = new AppPane( root );
		root.UpdateLayout();
		
		let self = this;

		EQFS.Init( onload );
		function onload()
		{
			self.AppPane.OnEQFSComplete();
		}
	};

	this.GMapReady = false;
};

function initGMap()
{
	Main.GMapReady = true;
	Main.AppPane && Main.AppPane.InitGMap();
}

let AppPane = class_def
(
	Pane,
	function()
	{
		this.Build = function()
		{
			this.e = q.div( null, { style: { border: "1px solid #8cf" } } );

			this.list = new ListPane( this, { Width: 240, Rel: 0, Height: -1 }, onselect );
			this.content = new ContentPane( this, { Width: 400, Rel: 10, Height: -1 } );
			this.bar = new BarPane( this, { Width: 48, Rel: 0, Height: -1, oncommand: barcommand } );

			this.Layout = Layout.Horiz;
			this.UpdateTitle();

			let self = this;
			function onselect( site )
			{
				self.content.SetSite( site );
			}

			function barcommand(  )
			{
				self.list.Enable = ! self.list.Enable;
				self.UpdateLayout();
			}
		};

		this.OnEQFSComplete = function()
		{
			this.list.SetData( EQFS.SiteList );
		};

		this.InitGMap = function()
		{
			console.log( google );
		};
	
		this.UpdateTitle = function()
		{
			document.title = "List 2";
		};
	}
);

let ContentPane = class_def
(
	Pane,
	function()
	{
		this.Build = function()
		{
			this.site = null;
			this.e = q.div( null, { "class": "Content" } );

			this.mappane = new MapPane( this, { Width: -1, Height: 50, Rel: 10, maphandler: this.maph() } );
			this.info = new GenPane( this, { Width: -1, Height: 27 } );

			this.Layout = Layout.Vert;
		};

		this.maph = function()
		{
			let self = this, h = {};
			h.idle = function() { self.UpdateInfo(); };
			return h;
		};

		this.SetSite = function( site )
		{
			this.site = site;
			this.mappane.SetCenter( site );
			this.UpdateInfo();
		};

		this.UpdateInfo = function()
		{
			let s = this.site, m = this.mappane.gmap;
			let si = s && [ s.code, s.name, "Lat " + s.lat, "Lng " + s.long, s.elev + "m", s.dep != "NA" ? s.dep + "m" : undefined ].join( ", " );
			let mi = m && [ q.frac( m.center.lat(), 4 ), q.frac( m.center.lng(), 4 ), m.getZoom() ].join( ", " );
			q.text( this.info.e, [ si, mi ].join( "|" ) );
		};
	}
);

let MapPane = class_def
(
	Pane,
	function( base )
	{
		this.Build = function()
		{
			this.e = q.div( null, { "class": "map" } );

			let center = { "lat": 36, "lng": 138 };
			this.gmap = new google.maps.Map
			(
				this.e, { "center": center, "zoom": 7, "scaleControl": true }
			);

			let hdls = this.Args.maphandler;
			hdls && hdls.idle && google.maps.event.addListener( this.gmap, "idle", hdls.idle );
			this.cmark = new google.maps.Marker( { "position": center, "map": this.gmap } );
		};

		this.SetCenter = function( site )
		{
			let pos = new google.maps.LatLng( site.lat, site.long );
			this.gmap.panTo( pos );

			let self = this;
			setTimeout
			(
				function() { self.cmark.setPosition( pos ); },
				210
			);
		};
	}
);

let BarPane = class_def
(
	Pane,
	function( base )
	{
		this.Initiate = function( com, args )
		{
			base.Initiate.call( this, com, args );
		}

		this.Build = function()
		{
			this.e = q.div();
			let self = this;
			
			new Pane
			(
				this,
				{ Width: -1, Height: 48 },
				{ type: "button", text: "L" }
			).e.onclick = function() { self.Args.oncommand( "toggle side" ) };
			
			new Pane
			(
				this,
				{ Width: -1, Height: 48 },
				{ type: "button", text: "L" }
			);
			
			this.Layout = Layout.Vert;
		};
	}
);

let ListPane = class_def
(
	Pane,
	function( base )
	{
		this.Initiate = function( com, args, onselect )
		{
			base.Initiate.call( this, com, args );
			this.onselect = onselect;
		};

		this.Build = function()
		{
			this.e = q.div( null, { "class": "list" } );

			new GenPane( this, { Width: -1, Height: 38, Text: "Path" } );
			this.content = new GenPane( this, { Width: -1, Height: 60, Rel: 10 } );
			this.content.e.className = "content";
			this.scroll = new Scrpad( this, { Width: -1, Height: 42 } );

			this.Layout = Layout.Vert;

			this.curitem = null;
		};

		this.SetData = function( data )
		{
			q.clr( this.content.e );

			for( var code in data )
			{
				new ListItem( this, this.content.e, data[ code ] );
			}

			this.scroll.SetNode( data );
		};

		this.onitemclick = function( item, data )
		{
			if( this.curitem ) this.curitem.SetSelected( false );
			this.curitem = item
			if( this.curitem ) this.curitem.SetSelected( true );
			this.onselect( data );
		};

		this.srcpadchange = function( value )
		{
			console.log( this.content.e.scrollTop, value );
			this.content.e.scrollTop = value * this.content.e.scrollHeight;
		};

		let ListItem = class_def
		(
			null,
			function()
			{
				this.Initiate = function( com, ce, site )
				{
					let caption = [ site.code, site.name, site.namer ].join( " " );
					this.e = q.div( ce, { "class": "item", text: caption } );

					let self = this;
					this.e.onclick = function(){ com.onitemclick( self, site ); };
				};

				this.SetSelected = function( value )
				{
					q.setc( this.e, "selected", value );
				};
			}
		);

		let Scrpad = class_def
		(
			Pane,
			function( base )
			{
				this.Build = function()
				{
					this.e = q.div();
					let s = q.span( this.e, { text: "scrpad" } );
					console.log( s.innerHTML );

					let self = this;
					this.e.onclick = function( ev )
					{
						let value = ev.offsetX / this.clientWidth;
						q.text( self.e, q.frac( value, 3 ) );
						self.Com && self.Com.srcpadchange && self.Com.srcpadchange( value );
					};
					this.e.ontouchmove = function( ev )
					{
						ev.stopPropagation();
						ev.preventDefault();
					};
					this.e.onmousemove = function( ev )
					{
						let value = ev.offsetX / this.clientWidth;
						q.text( self.e, q.frac( value, 3 ) );
						self.Com && self.Com.srcpadchange && self.Com.srcpadchange( value );
						ev.stopPropagation();
						ev.preventDefault();
					};
				};

				this.SetNode = function( node )
				{
					q.clr( this.e );
					q.text( this.e, node )
				};
			}
		);
	}
);

let GenPane = class_def
(
	Pane,
	function()
	{
		this.Build = function()
		{
			this.e = q.div( null, { style: this.Args.Style, text: this.Args.Text } );
			this.e.style.border = "1px solid #eec";
		};
	}
);
let App = class_def
(
	null,
	function()
	{
		this.SetHash = function(){};
		this.GetHash = function(){};
	}
);
