
let CollListPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.CssClass = args && args.CssClass || "COLL_LIST";
			this.ComNode = null;

			this.e = q.div( null, { "class": this.CssClass } );

			this.i = new DivPane( this, { Width: -1, Height: 40, Rel: 0, Text: "" } );
			this.Content = new DivPane
			(
				this, { Width: -1, Height: 40, Rel: 10, Class: this.CssClass + "_CONTENT" }
			);

			this.Layout = new Layout.Vert();

			this.Selection = args.Selection;
			let self = this;
			let view =
			{
				Select: function( node )
				{
					// console.log( "CollList.view.Select", node.GetCaption() );					
					self.Update();
				},

				Unselect: function( node )
				{
					;
				}
			};
			this.Selection.AddView( view );

			this.Update();
		};

		this.Update = function()
		{
			let node = this.Selection.GetCurrent();
			if( node && this.ComNode && ( node.Com == this.ComNode ) )
			{
				//  coll change  //

				q.text( this.i.e, "coll change " + node.GetCaption() );
			}
			else
			{
				//  com change  //
				this.SetComNode( node && node.Com || null );
			}
		};

		this.SetComNode = function( node )
		{
			this.ComNode = node;
			q.text( this.i.e, "com change " + ( node && node.GetCaption() ) );
			q.clr( this.Content.e );

			let self = this;
			let pref = this.CssClass;
			node && node.GetPartNodes( callback );

			function callback( parts )
			{
				for( var part of parts )  new ListItem( pref, self.Content.e, part, self.Selection );
			}
		};

		let ListItem = function( pref, com, node, selection )
		{
			let e = q.div( com, { "class": pref + "_ITEM", text: node.GetCaption() } );
			e.onclick = function() { selection.SetCurrent( node ); };
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
