
let Index = class_def
(
	null,
	function( base, ctor )
	{
		this.Type = "";

		this.GetPartNodes = function() {};
		this.GetHash = function( doc ) {};
	}
);

let RootIndex = class_def
(
	Index,
	function()
	{
		this.Type = "Root";
		this.GetHash = function( doc )
		{
			return "Page=Root";
		};
	}
);
