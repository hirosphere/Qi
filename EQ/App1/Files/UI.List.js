
let ListPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.Node = null;

			this.e = q.div( null, { "class": args && args.Class || "list" } );
			q.p( this.e, { text: "list" } );

			this.Selection = args.Selection;
			let self = this;
			let view =
			{
				Select: function( node )
				{
					self.Update();
				}
			};
			this.Selection &&  this.Selection.AddView( view );

			this.Update();
		};

		this.Update = function()
		{
			let node = this.Selection.GetCurrent();
			if( node && node.Com == this.Node )
			{

			}
			else
			{
				this.SetNode( node );
			}
		};

		this.SetNode = function( node )
		{
			this.Node = node;
			node && node.GetPartNodes( callback );

			function callback( parts )
			{
				;
			}
		};
	}
);

let PathSelectPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			args = args || {};

			this.e = q.div( null, { "class": args && args.Class } );
			this.content = q.span( this.e );

			this.Selection = args.Selection;
			let self = this;
			let view =
			{
				Select: function( node )
				{
					self.Update();
				}
			};
			this.Selection &&  this.Selection.AddView( view );

			this.Update();
		};

		this.SetSelection = function( selection )
		{
			console.log( "PathSelectPane" );
		};

		this.Update = function()
		{
			let sel = this.Selection;
			let node = sel && sel.GetCurrent();

			if( node == null )  return;

			let path = node.GetPath();

			q.clr( this.content );
			for( var pathitem of path )  new PathItem( this.content, pathitem, "PATH", onclick );

			let self = this;
			function onclick( node )
			{
				sel.SetCurrent( node );
			}
		};

		let PathItem = function( com, node, pref, onclick )
		{
			let e = q.span( com, { "class": pref + "_ITEM", text: node.GetCaption() } );
			e.onclick = function() { onclick( node ); };
		};
	}
);
