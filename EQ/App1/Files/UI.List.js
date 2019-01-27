
const PathSelectPane = class_def
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
			let t = q.span( com, { "class": pref + "_TERM", text: ">" } );
			e.onclick = function() { onclick( node ); };
		};
	}
);

let CollListPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.CssClass = args && args.CssClass || "COLL_LIST";
			this.ComNode = null;
			this.items = {};

			this.e = q.div( null, { "class": this.CssClass } );

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
					if( node && ( node.Com == self.ComNode ) )  self.SetItemState( node, true );
					else  self.UpdateContent();
				},

				Unselect: function( node )
				{
					self.SetItemState( node, false );
				}
			};
			this.Selection.AddView( view );

			this.UpdateContent();
		};

		this.UpdateContent = function()
		{
			let node = this.Selection.GetCurrent();
			let com = this.ComNode = node && node.Com;

			q.clr( this.Content.e );

			this.items = {};
			let self = this;
			com && com.GetPartNodes( callback );

			function callback( parts )
			{
				for( var part of parts )
					self.items[ part.rtid ] =
					  new ListItem( self.CssClass, self.Content.e, part, self.Selection );
				
				self.SetItemState( self.Selection.GetCurrent(), true, true );
			}
		};

		this.SetItemState = function( node, selected, scroll )
		{
			let item = node && this.items[ node.rtid ];
			item && item.SetState( selected );
			if( item && scroll )
			{
				this.Content.e.scrollTop = item.e.offsetTop - 50;
			}
		};

		let ListItem = function( pref, com, node, selection )
		{
			let e = this.e = q.div( com, { "class": pref + "_ITEM", text: node.GetCaption() } );
			e.onclick = function() { selection.SetCurrent( node ); };

			this.SetState = function( selected ) { q.setc( e, "SELECTED", selected ); };
		};
	}
);
