//


class App
{
	constructor( com )
	{
		const e = ecr( "section", com );
		ecr( "h1", e, { text: "Train-1 - Sui/2021" } );
	}
}


//

const ecr = ( type, com, args ) =>
{
	const e = document.createElement( type );
	if( args )
	{
		if( args.text ) e.innerText = args.text;
	}
	if( com ) com.appendChild( e );
	return e;
};
