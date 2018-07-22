
let PathList = class_def
(
	null,
	function()
	{
		this.Initiate = async function( com, className, selection )
		{
			this.e = q.div( com, { "class": className, text: className } );
			this.Selection = selection;
		};

		this.SetIndex = async function( index )
		{
			q.clr( this.e );
			for( let pathitem of index.GetPath() )
			{
				new Item( this.e, pathitem, this.Selection );
			}
		};

		function Item( com, index, selection )
		{
			q.span( com, { "class": "PATH_ITEM", text: Cu.Index.Path( index ) } )
				.onclick = function() { selection.Set( index ); } ;
			q.span( com, { "class": "PATH_ITEM_TERM", text: ">" } );
		}
	}
);

let EnterList = class_def
(
	null,
	function()
	{
		this.Initiate = async function( com, className, selection )
		{
			this.e = q.div( com, { "class": className, text: className } );
			this.Selection = selection;
		};

		this.SetIndex = async function( index )
		{
			q.clr( this.e );
			for( let part of await index.GetPartNodes() )  new Item( this.e, part, this.Selection );
		};

		function Item( com, index, selection )
		{
			q.span( com, { "class": "ENTER_ITEM", text: Cu.Index.Cap( index ) } )
				.onclick = function() { selection.Set( index ); } ;
			q.t( com, " " );
		}
	}
);

let List = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, className, selector, makecap )
		{
			this.ClassName = className;
			this.Selector = selector;
			this.MakeCap = makecap;

			this.Index = null;
			this.Current = null;
			this.Items = {};
			this.e = q.div( com, { "class": className } );
			this.con = this.e;
		};

		this.SetIndex = async function( index )
		{
			if( index == this.Index )  return;
			this.Index = index;
			q.clr( this.con );
			this.Items = {};
			if( this.Index == null )  return;

			for( let part of await index.GetPartNodes() )
			{
				this.Items[ part.Id ] = new List.Item( this.con, part, this.ClassName, this.Selector, this.MakeCap );
			}
		};

		this.SetCurrent = async function( index )
		{
			if( index == this.Current ) return;
			await this.SetIndex( index && index.Com );
			this.UpdateCurrent();
			this.Current = index;
			this.UpdateCurrent();
			this.Adjust( 40 );
		};

		this.Adjust = function( offset )
		{
			let item = this.Current && this.Items[ this.Current.Id ];
			if( ! item )  return;

			let io_pos = item.e.offsetTop + item.e.offsetHeight / 2;
			let cs_top = this.con.scrollTop;
			let cs_bottom = cs_top + this.con.clientHeight;

			if( io_pos < cs_top || io_pos > cs_bottom ) this.con.scrollTop = item.e.offsetTop - offset;
		};

		this.UpdateCurrent = function()
		{
			let item = this.Current && this.Items[ this.Current.Id ];
			item && item.Update();
		};
	}
);

List.Item = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, index, pref, selector, makecap )
		{
			this.Index = index;
			this.Selector = selector;
			this.MakeCap = makecap;

			this.e = q.span( com, { "class": pref + "_ITEM" } );
			q.span( com, { "class": pref + "_ITEM_TERM", text: " " } );

			let self = this;
			this.e.onclick = function() { selector.Set( index ); };

			this.Update();
		};

		this.Update = function()
		{
			q.text( this.e, this.MakeCap( this.Index ) );
			q.sc( this.e, "SELECTED", this.Index == this.Selector.Get() );
		};
	}
);
