var EQFS = new function()
{
	let module = this;
	// let pathbase = location.hostname == "localhost" ? "/D/GitHub/" : "/";
	let pathbase = location.hostname == "localhost" ? "/D/" : "/";
	let sitelistpath = pathbase + "EQ/sitepub_all_utf8.csv";
	let waveroot = pathbase + "EQ/Waves/";
	// let waveroot = pathbase + "Qi/EQ/SampleWaves/";

	this.Init = function( oncomplete )
	{
		console.log( "Init" );
		let mngr = new loadmngr( oncomplete, 1 );
		this.makesitelist( mngr );
		this.Root = new Root( waveroot );
	};

	class loadmngr
	{
		constructor( oncomplete, count ) { this.oncomplete = oncomplete; this.count = count; }
		onload() { if( -- this.count == 0 )  this.oncomplete(); }
	}

	let sitecols = [ "code", "name", "namer", "lat", "long", "elev", "dep", "pref", "prefr", "jlat", "jlong", "mtype" ];
	this.makesitelist = function( mngr )
	{
		let list = this.SiteList = {};
		let csv = q.get( sitelistpath, onload );
		function onload( csv )
		{
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
			mngr.onload();
		}
	};

	function Root( path )
	{
		this.Path = path;
		this.Name = "";
		this.GetPartNodes = getpartnodes;
	}

	function Folder( com_path, info )
	{
		this.Name = info[ 1 ];
		this.Path = com_path + this.Name + "/";
		this.GetPartNodes = getpartnodes;

		var mt;
		if( mt = this.Name.match( /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(.*)/ ) )
		{
			this.Caption =
			(
				mt[2] + "月" + mt[3] + "日  " + mt[4] + "時" + mt[5] + "分 " + mt[6] + "秒  " + mt[7]
			);
			return;
		}

		if( mt = this.Name.match( /^(\d{4})$/ ) )
		{
			this.Caption = mt[1] + "年";
			return;
		}

		this.Caption = this.Name;
	}

	function File( com_path, info, comnode )
	{
		this.Com = comnode;
		this.Name = info[ 1 ];
		this.Path = com_path + this.Name;

		let mt = this.Name.match( /^([0-9A-Z]{6})/ );
		if( mt )
		{
			let sitecode = mt[ 1 ];
			let site = this.Site = module.SiteList[ sitecode ];
			if( site ) this.Caption = [ site.code, site.name, site.namer ].join( " " );
			else this.Caption = this.Name;
		}
		else this.Caption = this.Name;

		this.LoadKwin = function( onload )
		{
			q.getb( this.Path, onload );
		};
	}

	function getpartnodes( onload )
	{
		if( this.PartNodes != null ) onload( this.PartNodes );
		let self = this;
		q.get
		(
			this.Path + "Index.txt",
			function( tsv )
			{
				let parts = [];
				let lines = tsv.split( /\r?\n/ );
				lines.pop();
				
				for( var r in lines )
				{
					let info = lines[ r ].split( "\t" );
					parts.push( createpart( self.Path, info, this ) );
				}
				self.PartNodes = parts;
				onload( parts );
			}
		)
	};

	function createpart( com_path, info, com )
	{
		if( info[ 1 ].match( /^[A-Z]{3}[0-9]{3}|^[A-Z]{4}[0-9]{2}/ ) )  return new File( com_path, info, com );
		if( info[ 0 ] == "Dir" ) return new Folder( com_path, info, com );
	}

	//    //

	let Waves = {};

	this.GetWave = function( filepath )
	{
		;
	};

};
