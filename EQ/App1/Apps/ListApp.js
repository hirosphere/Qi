
let Main = new function()
{
	this.Init = function()
	{
		let root = new RootPane();
		let apppane = new AppPane( root );
		root.UpdateLayout();


		EQFS.Init( eqfscomplete );

		function eqfscomplete()
		{
			apppane.OnEQFSComplete();
		};
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
		}
		
		this.Build = function()
		{
			this.Index = new RootIndex();
			this.CurrentIndex = new NodeSelection();

			this.e = q.div( null, { "class": "app" } );

			let vert = new DivPane( this, { Width: 200, Rel: 10, Height: -1, Layout: new Layout.Vert } );
			{
				this.pathsel = new PathSelectPane
				(
					vert, { Width: -1, Rel: 0, Height: 42, Class: "path", Selection: this.CurrentIndex }
				);

				let horiz = new DivPane
				(
					vert, { Width: -1, Height: 50, Rel: 10, Layout: new Layout.Horiz() }
				);
				{
					var side = new SidePane( horiz, { Width: 202, Rel: 0.2, Height: -1, App: this } );
					var content = new PageSwitchPane
					( horiz, { Width: 250, Rel: 10, Height: -1, App: this, CssClass: "CONTENT_SWITCH" } );
				}
			}

			this.Layout = new Layout.Horiz();
			this.UpdatePageTitle();
		};

		this.OnEQFSComplete = function()
		{
			this.CurrentIndex.Set( this.Index );
		};

		this.UpdatePageTitle = function()
		{
			document.title = "ListApp";
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

			new CollListPane( this, { Width: -1, Height: 50, Rel: 10, Selection: args.App.CurrentIndex } );
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
