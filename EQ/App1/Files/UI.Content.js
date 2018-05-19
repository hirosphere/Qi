
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
			this.e = q.div( null, { "class": "content" } );

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
			if( index == null )  return;

			// console.log( "Switch.Update", index.GetCaption() );


			let type = index.Type;
			if( this.CurContent )  this.CurContent.Enable = false;
			this.CurContent = this.Contents[ type ] || this.Contents[ type ] || this.CreateContent( index );
			this.CurContent.SetIndex( index );
			this.CurContent.Enable = true;

			this.UpdateLayout();
		};

		this.CreateContent = function( index )
		{
			return new Content.ListPane( this, { Width: 50, Rel: 10, Height: -1, App: this.App } );
		};
	}
);

let Content = {};

Content.ListPane = class_def
(
	Pane,
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

			function callback( nodes )
			{
				for( var part of nodes )  new ListItem( self.body, part, onclick );
			}

			function onclick( index )
			{
				// console.log( index.GetCaption() );
				self.App.CurrentIndex.Set( index );
			}
		};

		function ListItem( com, index, onclick )
		{
			let e = q.span( com, { text: index.GetCaption(), "class": "CONTENT_LIST_ITEM" } );
			e.onclick = function(){ onclick( index ); };
		}
	}
)

