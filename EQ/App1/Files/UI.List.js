
let ListPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": args && args.Class || "list" } );
			q.p( this.e, { text: "list" } );
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
			this.Selection = null;
			this.e = q.div( null, { "class": args && args.Class } );
			this.content = q.span( this.e );
			args && args.Selection && this.SetSelection( args.Selection );
			this.Update();
		};

		this.SetSelection = function( selection )
		{
			this.Selection = selection;
			let self = this;
			let view = this.selview =
			{
				Select: function( node )
				{
					// console.log( "path sel", node.GetCaption() );
					self.Update();
				}
			};
			selection.AddView( view );
			console.log( "PathSelectPane" );
		};

		this.Update = function()
		{
			let sel = this.Selection;
			let node = sel && sel.GetCurrent();
			console.log( "PathPane.Update", node && node.GetCaption() );
			//q.text( this.e, `${ node && node.GetCaption()}` );

			if( node == null )  return;

			let path = node.GetPath();

			q.clr( this.content );
			for( var pathitem of path )  new PathItem( this.content, pathitem, "PATH", onclick );

			let self = this;
			function onclick( node )
			{
				console.log( node.toString(), self.App && self.App.toString() );
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
