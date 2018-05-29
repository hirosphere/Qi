
let RTId = new function()
{
	var next_id = 0;
	this.next = function()
	{
		return ++ next_id;
	};
};

let Model = class_def
(
	null,
	function()
	{
		this.Initiate = function()
		{
			this._views = {};
		};

		this.AddView = function( view )
		{
			if( view == null )  return;

			view.rtid = view.rtid || RTId.next();
			this._views[ view.rtid ] = view;
		};

		this.RemoveView = function( view )
		{
			if( view && view.rtid )  delete this._views[ view.rtid ];
		};

		this.Notify = function( message, args )
		{
			for( var name in this._views )
			{
				let view = this._views[ name ];
				let fn = view && view[ message ];
				fn && fn.apply( view, args );
			}
		};
	}
);

Model.Value = class_def
(
	Model,
	function( base , ctor )
	{
		this.Initiate = function( initialvalue )
		{
			base.Initiate.call( this );
			this.Value = initialvalue;
		};

		this.GetValue = this.Get = function()
		{
			return this.Value;
		};

		this.SetValue = this.Set = function( value )
		{
			if( value === this.Value )  return;
			this.Value = value;
			this.Notify( "Change" );
		};
	}
);

let Tree = class_def
(
	Model,
	function( base )
	{
		;
	}
);

let Node = class_def
(
	null,
	function()
	{
		this.Initiate = function( com )
		{
			this.Com = com || null;
			this.rtid = RTId.next();
			this.PartNodes = [];
			if( com )  com.PartNodes.push( this );
		};

		this.GetPath = function()
		{
			let path = [];
			for( var iter = this; iter; iter = iter.Com )  path.unshift( iter );
			return path;
		};

		this.GetPartNodes = function( callback )
		{
			callback && callback( this.PartNodes );
		};

		this.GetCaption = function() { return "Node " + this.rtid; };

		this.toString = function() { return this.GetCaption(); };
	}
);

let NodeSelection = class_def
(
	Model,
	function( base )
	{
		this.Initiate = function()
		{
			base.Initiate.call( this );
			this.current = null;
		};

		this.Set = this.SetCurrent = function( node )
		{
			if( node == this.current )  return;

			let olditem = this.current;
			let newitem = this.current = node;
			if( olditem != null ) this.Notify( "Unselect", [ olditem ] );
			if( newitem != null ) this.Notify( "Select", [ newitem ] );
		};

		this.Get = this.GetCurrent = function()
		{
			return this.current;
		};

		this.toString = function()
		{
			return this.current ? this.current.GetCaption() : "null";
		};
	}
);
