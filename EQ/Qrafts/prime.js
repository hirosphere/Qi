function class_def( base, decor )
{
	var ctor = function()
	{
		if( this.Initiate ) this.Initiate.apply( this, arguments );
	};
	var proto = ctor.prototype;
	var baseproto = base && base.prototype;
	if( baseproto ) for( var fn in baseproto )  proto[ fn ] = baseproto[ fn ];
	decor.call( proto, baseproto );
	return ctor;
}

var q = new function()
{
	this.id = function( id ) { return document.getElementById( id ); };
	
	this.div = function( com, args ) { return this.e( "div", com, args ); };
	this.p = function( com, args ) { return this.e( "p", com, args ); };
	this.textarea = function( com, args ) { return this.e( "textarea", com, args ); };
	this.button = function( com, args ) { return this.e( "button", com, args ); };
	this.input = function( com, inputtype, args )
	{
		let e = this.e( "input", com, args );
		e.type = inputtype;
		return e;
	};
	this.check = function( com, args ) { return this.input( com, "checkbox", args ); };
	this.range = function( com, args ) { return this.input( com, "range", args ); };

	this.e = function( type, com, args  )
	{
		var e = document.createElement( type );
		if( args )
		{
			if( args.text !== undefined )  this.text( e, args.text );
			if( args.attrs != null )  for( var fn in args.attrs )  e[ fn ] = args.attrs[ fn ];
			if( args.style != null )  for( var fn in args.style )  e.style[ fn ] = args.style[ fn ];
		}
		com && com.appendChild( e );
		return e;
	};

	//

	this.text = function( e, text )
	{
		e.innerHTML = this.ht_plain( text );
	};

	this.ht_plain = function( text )
	{
		return ( "" + text ).replace( /<|>|&|  | |\t|\r\n|\r|\n/g, hp_rep );
	};
	
	var ht_rep_table =
	{
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;", 
		"  ": " &nbsp;",
		" ": "&nbsp;", 
		"\t": "&nbsp&nbsp&nbsp&nbsp;", 
		"\r\n": "<br/>\r\n",
		"\r": "<br/>\r\n",
		"\n": "<br/>\r\n" 
	};
	
	function hp_rep( ch )  {  return ht_rep_table[ ch ];  }
};

function SyncLoad( path )
{
	let req = new XMLHttpRequest();
	req.open( "get", path, false );
	req.send( null );
	return "" + req.responseText;
}
