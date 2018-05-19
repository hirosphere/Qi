
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
			var mt;
			if( mt = this.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})00/ ) )
			{
				return `${mt[1]}/${mt[2]}/${mt[3]} ${mt[4]}:${mt[5]}`;
			}
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
					if( item.Type == "File" )  new WaveIndex( self, self.Path, item.Name );
				}
				callback( self.PartNodes );
			}
		};
	}
);

let WaveIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Type = "Wave";

		this.Initiate = function( com, compath, name )
		{
			base.Initiate.call( this, com, compath, name );
			this.Path = compath + name;
			this.Name = name;
		};

		this.GetCaption = function()
		{
			var mt;
			if( mt = this.Name.match( /^([A-Z]{3,4})(\d{2,3})/ ) )
			{
				return `${mt[1]}${mt[2]}`;
			}
			return this.Name;
		};

		this.GetPartNodes = function( callback )
		{
			callback( [] );
		}
	}
);

let RootIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Type = "Folder";

		this.Initiate = function() { base.Initiate.call( this, null, "", "" ) };
		this.GetCaption = function() { return "EQ " };
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
