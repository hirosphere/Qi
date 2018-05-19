
let FolderIndex = class_def
(
	Node,
	function( base, bc, ctor )
	{
		this.Type = "Folder";
		this.PartIndex = ctor;

		this.Initiate = function( com, compath, name )
		{
			base.Initiate.call( this, com );
			this.Path = compath + name + ( name.length ? "/" : "" );
			this.Name = name;
		};

		this.GetCaption = function()
		{
			return this.Name;
		};

		this.GetPartNodes = function( callback )
		{
			if( this.PartNodes.length > 0 )
			{
				callback( this.PartNodes );
				return;
			}

			EQFS.GetIndex( this.Path, onload );

			let self = this;
			function onload( list )
			{
				for( var item of list )
				{
					if( item.Type == "Dir" )  new self.PartIndex( self, self.Path, item.Name );
				}
				callback( self.PartNodes );
			}
		};
	}
);

let YearIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Type = "Index";
		this.PartIndex = FolderIndex;

		this.GetCaption = function()
		{
			return this.Name;
		};
	}
);

let RootIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Type = "Index";
		this.PartIndex = YearIndex;

		this.Initiate = function() { base.Initiate.call( this, null, "", "" ) };
		this.GetCaption = function() { return "EQ " + this.Name };
	}
);

let GenIndex = class_def
(
	Node,
	function( base )
	{

		this.Initiate = function( com, caption, depth )
		{
			base.Initiate.call( this, com );
			this.Caption = caption;
			this.Depth = depth || 1;
		};

		this.GetCaption = function()
		{
			return this.Caption;
		};

		this.GetPartNodes = function( callback )
		{
			if( this.PartNodes.length == 0 )
			{
				for( var i = 1; i <= 10; i ++ ) new GenIndex( this, `Gen${ i }`, this.Depth + 1 );
			}
			callback( this.PartNodes );
		}
	}
);
