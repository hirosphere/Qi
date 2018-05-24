let EQFS = new function()
{
	let rootpath = location.host == "localhost" ? "/D/GitHub/EQ/" : "/EQ/";
	let wavespath = rootpath + "Waves/";

	this.Init = function( oncomplete )
	{
		//oncomplete();
		MakeSiteList( onload );

		let self = this;
		function onload( list )
		{
			self.SiteList = list;
			oncomplete();
		}
	};

	this.GetIndex = function( path, onload )
	{
		let realpath = wavespath + path + "Index.txt?DC=" + new Date().getTime();
		q.get( realpath, _onload );

		function _onload( csv )
		{
			// console.log( realpath );
			// console.log( csv );
			let list = [];
			let lines = csv.split( /\r?\n/ );
			lines.pop();
			for( var line of lines )
			{
				let cols = line.split( "\t" );
				list.push( { Type: cols[ 0 ], Name: cols[ 1 ], Size: cols[ 2 ] } );
			}
			onload( list );
		}
	};

	this.GetBinaryFile = function( path, onload )
	{
		q.getb( wavespath + path, onload );
	}

	let sitefs = [ "Code", "Name", "Namer", "Lat", "Lng", "Elev", "Depth", "Pref", "Prefr", "Latj", "Lngj", "Meter" ];

	function MakeSiteList( onload )
	{
		q.get( rootpath + "sitepub_all_utf8.csv", _onload );

		function _onload( csv )
		{
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
			onload( list );
		}
	}

	// site info //

	//  file system  //

	this.Root;

	let FSNode = class_def
	(
		Node,
		function( base )
		{
			this.Initiate = function( caption, path, name )
			{
				base.Initiate.call( this );
				this.Caption = caption;
				this.Path = path;
				this.Name = name;
			};

			this.GetPartNodes = function( callback )
			{
				;
			};
		}
	);

};
