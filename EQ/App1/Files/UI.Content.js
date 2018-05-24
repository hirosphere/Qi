
let PageSwitchPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.App = args.App;
			this.Contents = {};
			this.CurContent = null;

			this.Layout = new Layout.Horiz();
			this.e = q.div( null, { "class": args.CssClass } );

			let self = this;
			let view =
			{
				Select: function() { self.Update(); }
			};
			this.Cur = this.App.CurrentIndex;
			this.Cur.AddView( view );
			this.Update();
		};

		this.Update = function()
		{
			let index = this.Cur.GetCurrent();

			if( this.CurContent )  this.CurContent.Enable = false;
			this.CurContent = this.MakeContent( index );
			this.CurContent.SetIndex( index );
			this.CurContent.Enable = true;

			this.UpdateLayout();
		};

		this.MakeContent = function( index )
		{
			let pageid = index && index.Type || "null";
			var content = this.Contents[ pageid ];
			if( content ) return content;

			console.log( pageid );
			switch( pageid )
			{
				case "Dir":
					content = new Content.EnterList( this, { Width: 50, Rel: 10, Height: -1, App: this.App } );
					break;

				case "Wave":
					content = new Content.Wave( this, { Width: 50, Rel: 10, Height: -1, App: this.App } );
					break;
				
				default:
					content = new Content.Base( this, { Width: 50, Rel: 10, Height: -1 } );
					break;
			}

			return this.Contents[ pageid ] = content;
		};
	}
);

let Content = {};

Content.Base = class_def
(
	Pane,
	function()
	{
		this.SetIndex = function( index ) {};
	}
);

Content.EnterList = class_def
(
	Content.Base,
	function()
	{
		this.Build = function( args )
		{
			this.App = args.App;
			this.Node = args.Node;

			this.e = q.div( null, { "class": "CONTENT_LIST" } );
			this.body = q.div( this.e );
		};

		this.SetIndex = function( index )
		{
			q.clr( this.body );
			if( index == null )  return;
			let self = this;
			index.GetPartNodes( callback );
			function callback( nodes ) { for( var part of nodes ) new ListItem( self.body, part, onclick );  }
			function onclick( index )  { self.App.CurrentIndex.Set( index ); }
		};

		function ListItem( com, index, onclick )
		{
			let e = q.span( com, { text: index.GetCaption(), "class": "CONTENT_LIST_ITEM" } );
			e.onclick = function(){ onclick( index ); };
		}
	}
);

Content.EQPane = class_def
(
	Content.ListPane,
	function()
	{
		;
	}
);

Content.WavePane = class_def
(
	Pane,
	function()
	{
		;
	}
);

