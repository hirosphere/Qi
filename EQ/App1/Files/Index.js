
let Index = class_def
(
	Node,
	function( base, ctor )
	{
		//  Com, Path, Name  //

		this.Initiate = function( com, name )
		{
			base.Initiate.call( this, com );
			this.Name = name;
			if( com )  com.NamedPartNodes[ name ] = this;
		};

		this.LongCap = "Index";
	}
);

let FolderIndex = class_def
(
	Index,
	function( base, ctor )
	{
		this.Type = "Dir";
		this.PartIndex = ctor;

		this.Initiate = function( com, compath, name )
		{
			base.Initiate.call( this, com, name );
			
			this.LoadState = 0;
			this.getpartnodescallbacks = [];
			this.Path = compath + name + ( name.length ? "/" : "" );
			this.NamedPartNodes = {};
			this.MakeNodeClass();
		};

		this.MakeNodeClass = function()
		{
			var mt;
			if( mt = this.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})00$/ ) )
			{
				this.Type = "Dir";
				this.LongCap = `${mt[1]}年${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分`;
				this.Caption = `${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分`;
			}

			else if( mt = this.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(.+)?/ ) )
			{
				this.LongCap = `${mt[1]}年${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分${mt[6]}秒`;
				this.Caption = `${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分${mt[6]}秒 ${mt[7]}`;
			}

			else if( mt = this.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(.+)?/ ) )
			{
				this.LongCap = `${mt[1]}年${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分${mt[6]}秒`;
				this.Caption = `${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分 ${mt[6]}`;
			}

			else if( mt = this.Name.match( /(\d{4})/ ) )
			{
				this.LongCap = `${mt[1]}年`;
				this.Caption = `${mt[1]}年`;
			}

			else
			{
				this.Caption = this.Name;
			}
		}

		this.GetCaption = function()
		{
			return this.Caption;
		};

		this.GetPartNodes = function( callback )
		{
			if( this.LoadState == 2 )
			{
				callback( this.PartNodes );
				return;
			}

			this.getpartnodescallbacks.push( callback );
			if( this.LoadState == 1 )  return;
			
			this.LoadState = 1;

			EQFS.GetIndex( this.Path, onload );

			let self = this;
			function onload( list )
			{
				for( var item of list )
				{
					if( item.Type == "Dir" )  new self.PartIndex( self, self.Path, item.Name );
					if( item.Type == "File" )
					{
						new WaveIndex( self, self.Path, item, true );
						item.IsKiK && new WaveIndex( self, self.Path, item, false ); 
					}
				}
				self.LoadState = 2;

				for( var callback of self.getpartnodescallbacks ) callback( self.PartNodes );
				self.getpartnodescallbacks.length = 0;
			}
		};
	}
);

let RootIndex = class_def
(
	FolderIndex,
	function( base )
	{
		this.Initiate = function() { base.Initiate.call( this, null, "", "" ) };
		this.GetCaption = function() { return "トップ" };
		this.LongCap = "トップ";
	}
);

let WaveIndex = class_def
(
	Index,
	function( base )
	{
		this.Initiate = function( com, compath, info, issurf )
		{
			let name = info.Name + ( info.IsKiK ? ( issurf ? "+Sur" : "+Un" ) : "" )
			base.Initiate.call( this, com, name );
			this.Path = compath + name;
			this.IsSurf = issurf;

			this.MakeCaption();
		};

		this.GetCaption = function() { return this.Caption; };
		
		this.MakeCaption = function()
		{
			var mt;
			if( mt = this.Name.match( /^([A-Z]{3}\d{3}|[A-Z]{4}\d{2})(\d+)?/ ) )
			{
				let code = mt[ 1 ];
				let site = this.Site = EQFS.SiteList[ code ];
				let surf = ( this.IsSurf ? "" : " (地中)" );
				this.IsKiK = code[ 3 ] == "H";
				this.Caption = site ? `${ site.Code } ${ site.Name } ${ site.Namer }${ surf }` : this.Name;

				let date = mt[ 2 ];
				if( mt )
				{
					this.Type = "Wave";

					let sitecap =  site ? `${ site.Code } ${ site.Pref } ${ site.Name } ${ site.Namer }${ surf }` : "----";
					if( mt = date.match( /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/ ) )
					{
						this.LongCap = `${ sitecap } ( 20${mt[1]}年${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分 )`;
						return;
					}

					if( mt = date.match( /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/ ) )
					{
						this.LongCap = `${ sitecap } ( ${mt[1]}年${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分${mt[6]}秒 )`;
						return;
					}
				}

				this.LongCap = this.Caption;
				return;
			}

			this.LongCap = this.Caption = this.Name;
		};
	}
);

