let EQFS = new function()
{
	let pathbase = location.hostname == "localhost" ? "/D/GitHub/" : "";
	let sitelistpath = pathbase + "/EQ/sitepub_all_utf8.csv";
	
	this.Init = function()
	{
		this.makesitelist();
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
			if( site.code.length >= 6 )  list[ site.code ] = site;
		}
		list.count = lines.length;
		this.SiteList = list;
	}







	this.Init();

};
