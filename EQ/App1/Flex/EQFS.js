let EQFS = new function()
{
	let rootpath = location.host == "localhost" ? "/D/GitHub/EQ/" : "/EQ/";
	let wavepath = rootpath + "Waves/";

	this.Init = async function( oncomplete )
	{
		this.SiteList = await MakeSiteList( onload );
	};

	// index //

	this.RootPath = rootpath;
	this.WavePath = wavepath;
	
	this.GetYearIndex = async function() { return await this.GetIndex( this.WavePath ); };
	
	this.GetEQIndex = async function( year )
	{
		let items = await this.GetIndex( this.WavePath + year + "/" );
		for( let item of items )  MakeEQSpec( item );
		return items;
	};

	this.GetWaveIndex = async function( eqspec )
	{
		return await this.GetIndex( GetEQPath( eqspec ) );
	};

	// file path //

	this.GetEQPath = GetEQPath;


	function GetEQPath( spec )
	{
		let v = GetEQSpecValues( spec );
		if( ! v )  return null;

		if( ! v.s )  return wavepath + `${ v.Y }/${ v.Y }${ v.M }${ v.D }${ v.h }${ v.m }00/`;
		return wavepath + `${ v.Y }/${ v.Y }${ v.M }${ v.D }${ v.h }${ v.m }${ v.s }${ v.ex }/`;
	}

	//  //

	function MakeEQSpec( item, inst, knet )
	{
		let mt = item.Name.match( /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(.+)?/ );
		item.Spec = mt ? `${mt[1]}/${mt[2]}/${mt[3]}+${mt[4]}:${mt[5]}` : item.Name;
		item.IsEQ = mt != null;
	}

	this.GetEQSpecValues = GetEQSpecValues;

	function GetEQSpecValues( spec )
	{
		let mt = spec.match( /^(\d{4})\/(\d{2})\/(\d{2})\+(\d{2}):(\d{2})(:(\d{2}))?(.+)?/ );
		return mt && { Y: mt[ 1 ], M: mt[ 2 ], D: mt[ 3 ], h: mt[ 4 ], m: mt[ 5 ], s: mt[ 7 ] || "", ex: mt[ 8 ] || "",  } || null;
	};

	//  //

	this.GetIndex = async function( path )
	{
		let realpath = path + "Index.txt?DC=" + new Date().getTime();
		let csv = await LoadFile( realpath );

		// console.log( realpath );
		//console.log( csv );

		let list = [];
		let lines = csv.split( /\r?\n/ );
		lines.pop();
		for( var line of lines )
		{
			let cols = line.split( "\t" );
			let type = cols[ 0 ];
			let name = cols[ 1 ];
			let size = cols[ 2 ];

			if( type == "Dir" )
			{
				list.push( { Type: type, Name: name, Size: size } );
			}
			else if( type == "File" )
			{
				let isKiK = name.match( /^[A-Z]{4}[0-9]{2}/ ) != null;
				list.push( { Type: type, Name: name, Size: size, IsKiK: isKiK, IsUnder: false } );
				isKiK && list.push( { Type: type, Name: name, Size: size, IsKiK: isKiK, IsUnder: true } );
			}
		}
		return list;
	};


	//  Site Info  //

	let sitefs = [ "Code", "Name", "Namer", "Lat", "Lng", "Elev", "Depth", "Pref", "Prefr", "Latj", "Lngj", "Meter" ];

	async function MakeSiteList()
	{
		let csv = await LoadFile( rootpath + "sitepub_all_utf8.csv" );

		let list = {};
		let lines = csv.split( /\r?\n/ );
		lines.pop();
		for( var line of lines )
		{
			let cols = line.split( "," );
			let item = {};
			for( var i = 0; i < sitefs.length; i ++ )  item[ sitefs[ i ] ] = cols[ i ]; 
			list[ item.Code ] = item;
		}
		return list;
	};

	//  //

	this.GetBinaryFile = async function( path )
	{
		return new Promise
		(
			function( resolve, reject )
			{
				let req = new XMLHttpRequest();
				req.open( "GET", path );
				req.responseType = "arraybuffer";
				req.onload = () => resolve( req.response );
				req.send();
			}
		);
	};

	function LoadFile( path )
	{
		return new Promise
		(
			function( resolve, reject )
			{
				let req = new XMLHttpRequest();
				req.open( "GET", path );
				req.onload = () => resolve( req.responseText );
				req.send();
			}
		);
	}

};
