let EQFS = new function()
{
	let pathbase = location.hostname == "localhost" ? "/D/GitHub/" : "/";
	let sitelistpath = pathbase + "EQ/sitepub_all_utf8.csv";
	let waveroot = pathbase + "EQ/Waves/";

	this.Init = function()
	{
		this.makesitelist();
		this.Root = new Root();
	};

	let sitecols = [ "code", "name", "namer", "lat", "long", "elev", "dep", "pref", "prefr", "jlat", "jlong", "mtype" ];
	this.makesitelist = function()
	{
		let list = {};
		let csv = q.get( sitelistpath );
		let lines = csv.split( /\r?\n/ );
		for( var r = 0; r < lines.length; r ++ )
		{
			let values = lines[ r ].split( "," );
			let site = {};
			let prefcode = values[ 0 ].substr( 0, 3 );
			for( var c = 0; c < sitecols.length; c ++ )
			{
				site[ sitecols[ c ] ] = values[ c ];
			}
			if( values.length >= 12 )  list[ site.code ] = site;
		}
		list.count = lines.length;
		this.SiteList = list;
	};

	function Root( path )
	{
		this.GetPartNodes = function()
		{
			if( this.PartNodes != null ) return this.PartNodes;

			let items = [];
			let lines = q.get( waveroot + "Index.txt" ).split( /\r?\n/ );
			lines.pop();
			
			for( var r in lines )
			{
				items.push( new Folder( waveroot, lines[ r ].split( "\t" ) ) );
			}
			return this.PartNodes = items;
		};
	}

	function Folder( com_path, info )
	{
		console.log( com_path + " - " + info );
		this.Name = info[ 1 ];
		this.Path = com_path + this.Name + "/";
	}







	this.Init();

};
