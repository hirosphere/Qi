
let Index = class_def
(
	null,
	function( base, ctor )
	{
		this.Type = "";
		this.FilePath = "";

		var nextId = 0;

		this.Initiate = function( com )
		{
			this.Id = ++ nextId;
			this.Com = com;
			if( com ) com.PartBySpec[ this.Spec ] = this;
			this.PartBySpec = {};
		};

		this.GetPath = function( list )
		{
			( list = list || [] ).unshift( this );
			this.Com && this.Com.GetPath( list );
			return list;
		};
		
		this.GetPartNodes = function() { return [] };

		this.GetPartBySpec = async function( spec )
		{
			await this.GetPartNodes();
			return this.PartBySpec[ spec ] || null;
		};

		this.GetMicro = async function( path )
		{
			if( ! path || path.length == 0 ) return this;

			let spec = path.shift();
			let part = await this.GetPartBySpec( spec );
			if( part && path.length > 0 )  return await part.GetMicro( path );
			return part || this;
		};
	}
);

let RootIndex = class_def
(
	Index,
	function()
	{
		this.Type = "Root";

		this.GetPartNodes = async function()
		{
			if( this.partNodes )  return this.partNodes;
			
			this.partNodes = [];
			for( var fileInfo of await EQFS.GetYearIndex() )
			{
				this.partNodes.push( new YearIndex( this, fileInfo ) );
			}
			return this.partNodes;
		};
	}
);

let YearIndex = class_def
(
	Index,
	function( base )
	{
		this.Type = "Year";
		this.Initiate = function( com, fileInfo )
		{
			this.Spec = fileInfo.Name;
			base.Initiate.call( this, com );
		};

		this.GetPartNodes = async function()
		{
			if( this.partNodes )  return this.partNodes;
			
			this.partNodes = [];
			for( var info of await EQFS.GetEQIndex( this.Spec ) )
			{
				if( info.IsEQ ) this.partNodes.push( new EQIndex( this, info ) );
				else if( info.Type == "Dir" )  this.partNodes.push( new FolderIndex( this, this.Spec + "/", info ) );
			}
			return this.partNodes;
		};
	}
);

let EQIndex = class_def
(
	Index,
	function( base )
	{
		this.Type = "EQ";
		this.Initiate = function( com, fileInfo )
		{
			this.Spec = fileInfo.Spec;
			base.Initiate.call( this, com );
			this.EQ = fileInfo.Name;
			this.FilePath = EQFS.GetEQPath( this.Spec );
		};

		this.GetPartNodes = async function()
		{
			if( this.partNodes )  return this.partNodes;

			this.partNodes = [];
			for( var fileInfo of await EQFS.GetWaveIndex( this.Spec ) )
			{
				this.partNodes.push( new WaveIndex( this, this.Spec, this.FilePath, fileInfo ) );
			}
			return this.partNodes;
		};
	}
);

let WaveIndex = class_def
(
	Index,
	function( base )
	{
		this.Type = "Wave";
		this.Initiate = function( com, eqspec, path, fileinfo )
		{
			this.Name = fileinfo.Name;
			this.EQSpec = eqspec;
			this.FilePath = path + fileinfo.Name;
			this.IsKiK = fileinfo.IsKiK;
			this.IsUnder = fileinfo.IsUnder;

			var mt;
			if( mt = this.Name.match( /^([A-Z]{3}[0-9]{3}|[A-Z]{3}H[0-9]{2})/ ) )
			{
				this.Site = EQFS.SiteList[ mt[ 1 ] ];
				this.Spec = mt[ 1 ];
			};

			base.Initiate.call( this, com );
		};

		this.GetWave = function()
		{
			return EQWave.Get( this.FilePath, this.IsUnder );
		};
	}
);


let FolderIndex = class_def
(
	Index,
	function( base )
	{
		this.Type = "Folder";
		this.Initiate = function( com, path, fileInfo )
		{
			this.Spec = fileInfo.Name;
			this.FilePath = path + this.Spec + "/"
			base.Initiate.call( this, com, this.Spec );
			this.Path = path + this.Spec + "/";
		};

		this.GetPartNodes = async function()
		{
			if( this.partNodes )  return this.partNodes;

			this.partNodes = [];
			for( var info of await EQFS.GetIndex( "Waves/" + this.Path ) )
			{
				if( info.Type = "Dir" ) this.partNodes.push( new FolderIndex( this, this.Path, info ) );
				else if( info.Type = "File" ) this.partNodes.push( new WaveIndex( this, null, this.Path, info ) );
			}
			return this.partNodes;
		};
	}
);

