
let RootPage = class_def
(
	null,
	function()
	{
		this.Initiate = function( com )
		{
			this.e = q.vert( com, { "class": "RP" } );
			this.title = q.h1( this.e, { text: "Root" } );
		};

		this.SetIndex = function( index )
		{
			q.text( this.title, Cu.Caption.Get( index ) );
		};
	}
);
