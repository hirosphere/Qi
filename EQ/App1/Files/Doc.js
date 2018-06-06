let Doc = function()
{
	//    //

	this.Modified = new Model.Value( false );

	this.RootIndex = new RootIndex();
	this.CurrentIndex = new NodeSelection();

	this.Audio = EQAudio.CreatePlayer();

	//    //

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
	
	//    //

	this.GetHash = function()
	{
		let index = this.CurrentIndex.Get();
		return "#" + "Page=" + index.Path;
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

		console.log( "SetHash", values );
		if( values.Page )
		{
			let list = values.Page.split( "/" );
			makeIndexPath( this.RootIndex, list, onpath );
		}

		function onpath( node )
		{
			console.log( node.LongCap );
			self.CurrentIndex.Set( node || self.RootIndex );
		}
	};

	function makeIndexPath( node, list, callback )
	{
		if( list.length == 0 )
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
			console.log( "makeIndexPath", part && part.LongCap );
			part && makeIndexPath( part, list, callback );
		}
	}
};
