function class_def( base, decor )
{
	var ctor = function()
	{
		this.Initiate.apply( this, arguments );
	};
	var proto = ctor.prototype;
	proto.Initiate = function(){};
	var baseproto = base && base.prototype;
	if( baseproto ) for( var fn in baseproto )  proto[ fn ] = baseproto[ fn ];
	decor.call( proto, baseproto, ctor, base );
	return ctor;
}

var q = new function()
{
	//  html dom  //

	this.id = function( id ) { return document.getElementById( id ); };
	
	this.div = function( com, args ) { return this.e( "div", com, args ); };

	this.h1 = function( com, args ) { return this.e( "h1", com, args ); };
	this.h2 = function( com, args ) { return this.e( "h2", com, args ); };
	this.h3 = function( com, args ) { return this.e( "h3", com, args ); };
	this.h4 = function( com, args ) { return this.e( "h4", com, args ); };

	this.p = function( com, args ) { return this.e( "p", com, args ); };
	this.span = function( com, args ) { return this.e( "span", com, args ); };

	this.table = function( com, args ) { return this.e( "table", com, args ); };
	this.tbody = function( com, args ) { return this.e( "tbody", com, args ); };
	this.tr = function( com, args ) { return this.e( "tr", com, args ); };
	this.td = function( com, args ) { return this.e( "td", com, args ); };

	this.textarea = function( com, args ) { return this.e( "textarea", com, args ); };
	this.button = function( com, args ) { return this.e( "button", com, args ); };
	this.select = function( com, args ) { return this.e( "select", com, args ); };
	this.option = function( com, args ) { return this.e( "option", com, args ); };
	this.input = function( com, inputtype, args )
	{
		let e = this.e( "input", com, args );
		e.type = inputtype;
		return e;
	};
	this.check = function( com, args ) { return this.input( com, "checkbox", args ); };
	this.range = function( com, args ) { return this.input( com, "range", args ); };
	this.fr = function() { return document.createDocumentFragment(); };

	this.e = function( type, com, args  )
	{
		var e = document.createElement( type || args && args.type );
		if( args )
		{
			if( args.text !== undefined )  this.text( e, args.text );
			if( args.class !== undefined )  e.className = args.class;
			if( args.attrs != null )  for( var fn in args.attrs )  e[ fn ] = args.attrs[ fn ];
			if( args.style != null )  for( var fn in args.style )  e.style[ fn ] = args.style[ fn ];
		}
		com && com.appendChild( e );
		return e;
	};

	this.t = function( text ) { return document.createTextNode( text ); };

	//

	this.clr = this.clear = function( e )
	{
		while( e.childNodes.length > 0 )  e.removeChild( e.lastChild );
	};

	this.text = function( e, text )
	{
		e.innerHTML = this.ht_plain( text );
	};

	this.ht_plain = function( text )
	{
		return ( "" + text ).replace( /<|>|&|  | |\t|\r\n|\r|\n/g, hp_rep );
	};

	this.sc = this.setc = this.setclass = function( e, name, value )
	{
		value ? this.ac( e, name ) : this.rc( e, name );
	};

	this.ac = this.addc = this.addclass = function( e, name )
	{
		if( e.className.search( name ) < 0 )  e.className += " " + name; 
	};

	this.rc = this.rmvc = this.removeclass = function( e, name )
	{
		let regex = new RegExp( "(^| )" + name + "( |$)" );
		e.className = e.className.replace( regex, rmvcfn );
	}

	function rmvcfn( all, a, b ) { return b; }
	
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

	//  http  //

	this.get = function( path, onload )
	{
		let req = new XMLHttpRequest();
		req.open( "get", path, true );
		req.onload = function( ev )
		{
			onload( req.responseText );
		};
		// console.log( path );
		req.send( null );
		return "" + req.responseText;
	};

	this.getb = function( path, onload )
	{
		let req = new XMLHttpRequest();
		req.open( "get", path, true );
		req.responseType = "arraybuffer";
		req.onload = function( ev )
		{
			onload( req.response );
		};
		//console.log( path );
		req.send( null );
	};

	//  //


	//  //

	this.frac = function( v, sc )
	{
		let s = Math.pow ( 10, sc );
		return Math.round( v * s ) / s;
	};
};
