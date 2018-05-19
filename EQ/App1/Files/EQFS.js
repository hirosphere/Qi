let EQFS = new function()
{
	let rootpath = location.host == "localhost" ? "/D/GitHub/EQ/" : "/EQ/";

	this.Init = function( oncomplete )
	{
		//oncomplete();
		MakeSiteList( onload );

		function onload()
		{
			;
		}

		oncomplete();
	};

	this.GetIndex = function( path, onload )
	{
		q.get( rootpath + "Waves/" + path + "Index.txt", _onload );

		function _onload( csv )
		{
			
			let list = [];
			let lines = csv.split( /\r?\n/ );
			for( var line of lines )
			{
				let cols = line.split( "\t" );
				let item = { Type: cols[ 0 ], Name: cols[ 1 ], Size: cols[ 2 ] };
				list.push( item );
			}
			onload( list );
		}
	};

	function MakeSiteList( onload )
	{
		//q.get( rootpath + "sitepub_all_utf8.csv", onload );
		//q.get( rootpath + "/Waves/Index.txt", onload );

		function onload( csv )
		{
			console.log( csv );
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
