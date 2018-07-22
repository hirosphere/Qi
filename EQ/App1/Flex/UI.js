let UI = {};

//  //

UI.StateButton = function( com, labels, value, onclick )
{
	let e = q.button( com );
	e.onclick = function() { onclick( value ); };
	value.AddView( function( value )
	{
		q.text( e, labels[ value.Get() ] );
	});
};
