
const ecr = ( type, com, args ) =>
{
	const e = document.createElement( type );
	if( args )
	{
		if( args.class ) e.className = args.class;
		if( args.text )  e.innerText = args.text;
		if( args.attrs ) for( const n in args.attrs ) e[ n ] = args.attrs[ n ];
		if( args.style ) for( const n in args.style ) e.style[ n ] = args.style[ n ];
	}
	if( com ) com.appendChild( e );
	return e;
}

