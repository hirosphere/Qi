console.log( "Prime" );

//  基本 / HTML / DOM //

//  基本  //

const ecr = ( type, com, args ) =>
{
	const e = document.createElement( type );
	if( args )
	{
		if( args.class ) e.className = args.class;
		if( args.text != null ) e.innerText = args.text;
		if( args.attr ) for( const n in args.attr ) e[ n ] = args.attr[ n ];
		if( args.style ) for( const n in args.style ) e.style[ n ] = args.style[ n ];
	}
	if( com )  com.appendChild( e );
	return e;
};

//  HTML  //

//  DOM  //

