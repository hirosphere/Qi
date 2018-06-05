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
			console.log( self.GetHash() );
		}
	};

	this.CurrentIndex.AddView( changeview );
	
	this.Modified.AddView( { Change: function() { console.log( "Doc.Modified: ", self.Modified.Get() ); } } );
	
	//    //

	this.GetHash = function()
	{
		let hash = "#";
		let index = this.CurrentIndex.Get();
		hash += "p=" + index.Path + ( index.Type == "Wave" ? ( index.IsSurf ? "/s" : "/u" ) : "" );
		return hash;
	};
	
};

let Hash = new function()
{
	this.Encode = function( value )
	{
		;
	};

	function encode( value )
	{
		;
	}
};
