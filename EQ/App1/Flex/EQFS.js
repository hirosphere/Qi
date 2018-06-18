let EQFS = new function()
{
	let rootpath = location.host == "localhost" ? "/D/GitHub/EQ/" : "/EQ/";
	let wavespath = rootpath + "Waves/";

	this.Initialize = function( oncomplete )
	{
		this.SiteList = MakeSiteList( onload );
	};

	this.GetIndex = function( path, callback )
	{
		let realpath = wavespath + path + "Index.txt?DC=" + new Date().getTime();
		q.get( realpath, onload );

		function onload( csv )
		{
			// console.log( realpath );
			// console.log( csv );
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
					let isKik = name.match( /^[A-Z]{3}H/ ) != null;
					list.push( { Type: type, Name: name, Size: size, IsKiK: isKik } );
				}
			}
			callback( list );
		}
	};

	this.GetBinaryFile = function( path, onload )
	{
		q.getb( wavespath + path, onload );
	}


	//  Site Info  //

	let sitefs = [ "Code", "Name", "Namer", "Lat", "Lng", "Elev", "Depth", "Pref", "Prefr", "Latj", "Lngj", "Meter" ];

	async function MakeSiteList( onload )
	{
		let csv = await LoadFile( "sitepub_all_utf8.csv" );
		console.log( "MakeSiteList", csv.substr( 0, 100 ) )

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
		console.log( "MakeSiteList", csv.substr( 0, 100 ) )
		return list;
	};

	//  //

	function LoadFile( path )
	{
		return new Promise
		(
			function( resolve, reject )
			{
				let req = new XMLHttpRequest();
				req.open( "GET", rootpath + path );
				req.onload = () => resolve( req.responseText );
				req.send();
			}
		);
	}

};
