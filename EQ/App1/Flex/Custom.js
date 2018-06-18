
let Cu = {};
Cu.Index = {};

Cu.Index.Caption = new function()
{
	this.Get = function( index ) { return ( types[ index.Type ] || types.root )( index ); };

	let types =
	{
		root: function( index ) { return "Root" }
	};
};

Cu.Index.PathCap =
{
	Root: function( index ) { return "Root"; }
};

Cu.Page = {};

Cu.Page.Wave =
{
	MapBt: [ "リスト", "マップ" ]
};

