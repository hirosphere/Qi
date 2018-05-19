
let FolderIndex = class_def
(
	Node,
	function( base )
	{
		this.Type = "Folder";

		this.Initiate = function( com, caption, compath, name )
		{
			base.Initiate.call( this, com );
			this.Caption = caption;
			this.Path = compath + name + ( name.length ? "/" : "" );
			this.Name = name;
			console.log( this.Path, caption );
		};

		this.GetCaption = function()
		{
			return this.Caption;
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
					if( item.Type == "Dir" )  new FolderIndex( self, item.Name, self.Path, item.Name );
				}
				callback( self.PartNodes );
			}
		};
	}
);

let RootIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Type = "Index";

		this.Initiate = function()
		{
			base.Initiate.call( this, null, "EQ", "", "" );
		};
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
