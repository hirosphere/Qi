
let DocCore = function()
{
	this.Modified = new Model.Value( false );
	this.RootIndex = new RootIndex();
	this.CurrentIndex = new NodeSelection();
	this.AudioPlayer = EQAudio.CreatePlayer();
};


let Doc = function()
{
	DocCore.call( this );

	let self = this;
	let changeview =
	{
		Select: function()
		{
			self.Modified.Set( true );
		}
	};
	this.CurrentIndex.AddView( changeview );
	this.Modified.AddView( { Change: function() { self.Modified.Get(); } } );
	

	//  Hash  //

	this.GetHash = function()
	{
		let index = this.CurrentIndex.Get();
		return "#" +
			"Page=" + index.Path +
			"&Au=" + this.AudioPlayer.GetHash()
		;
	};
	
	this.SetHash = function( hash )
	{
		let self = this;
		
		let lines = ( hash + "" ).replace( "#", "" ).split( "&" );
		let values = {};
		for( var line of lines )
		{
			let kv = line.split( "=" );
			values[ kv[ 0 ] ] = kv[ 1 ];
		}

		//  Page  //

		let page = values.Page;
		let list = page && page.split( "/" );
		makeIndexPath
		(
			this.RootIndex,
			list || "", 
			function( node ) { self.CurrentIndex.Set( node || self.RootIndex ); }
		);

		//  Audio  //

		this.AudioPlayer.SetHash( values.Au );

	};

	function makeIndexPath( node, list, callback )
	{
		if( list.length == 0 || node && node.Type != "Dir" )
		{
			callback( node );
			return;
		}

		let self = this;
		let name = list.shift();

		node.GetPartNodes( onload );

		function onload()
		{
			let part = node.NamedPartNodes[ name ];
			part ? makeIndexPath( part, list, callback ) : callback( node );
		}
	}
};
