
let DocCore = function()
{
	this.RootIndex = new RootIndex();
	this.CurrentIndex = new Value( null );
};

let Doc = function()
{
	DocCore.call( this );

	// Hash //

	this.ImportHash = function()
	{
		let hash = location.hash.toString().replace( /^#/, "" ).split( "&" );
		let values = {};
		for( var kv of hash ) {  }
		this.CurrentIndex.Set( this.RootIndex );
	};

	this.ExportHash = function()
	{
		let index = this.CurrentIndex.Get();
		
		location.hash = "#" + ( index ? index.GetHash( this ) : "--" );
	};

	//  //
};
