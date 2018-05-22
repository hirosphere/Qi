
let FolderIndex = class_def
(
	Node,
	function( base, bc, ctor )
	{
		this.Type = "Dir";
		this.PartIndex = ctor;

		this.Initiate = function( com, compath, name )
		{
			base.Initiate.call( this, com );
			
			this.PartMaked = 0;
			this.getpartnodescallbacks = [];
			this.Path = compath + name + ( name.length ? "/" : "" );
			this.Name = name;
		};

		this.GetCaption = function()
		{
			var mt;
			if( mt = this.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})00/ ) )
			{
				return `${mt[1]}/${mt[2]}/${mt[3]}  ${mt[4]}時${mt[5]}分`;
			}
			return this.Name;
		};

		this.GetPartNodes = function( callback )
		{
			if( this.PartMaked == 2 )
			{
				callback( this.PartNodes );
				return;
			}

			this.getpartnodescallbacks.push( callback );
			if( this.PartMaked == 1 )  return;
			
			this.PartMaked = 1;

			EQFS.GetIndex( this.Path, onload );

			let self = this;
			function onload( list )
			{
				for( var item of list )
				{
					if( item.Type == "Dir" )  new self.PartIndex( self, self.Path, item.Name );
					if( item.Type == "File" )  new WaveIndex( self, self.Path, item.Name );
				}
				self.PartMaked = 2;
				for( var callback of self.getpartnodescallbacks ) callback( self.PartNodes );
				self.getpartnodescallbacks.length = 0;
			}
		};
	}
);

let WaveIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Initiate = function( com, compath, name )
		{
			base.Initiate.call( this, com, compath, name );
			this.Path = compath + name;
			this.Name = name;

			var iswave = name.match( /\.kwin$/ );

			if( iswave ) this.Type = "Wave";
		};

		this.GetCaption = function()
		{
			var mt;
			if( mt = this.Name.match( /^([A-Z]{3}\d{3}|[A-Z]{4}\d{2})/ ) )
			{
				let code = mt[ 1 ];
				let site = EQFS.SiteList[ code ];
				return site ? `${ site.Code } ${ site.Name }` : this.Name;
			}
			return this.Name;
		};
	}
);

let RootIndex = class_def
(
	FolderIndex,
	function( base )
	{
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
