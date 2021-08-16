
const ecr = ( type, com, args ) =>
{
	const e = document.createElement( type );
	if( args )
	{
		if( args.class ) e.className = args.class;
		if( args.text !== undefined ) e.innerText = args.text;
		if( args.attrs ) for( let fn in args.attrs ) e[ fn ] = args.attrs[ fn ];
	}
	if( com ) com.appendChild( e );
	return e;
}


const df = function( format, date )
{
	date = date || new Date();
	var args = arguments;
	return ( "" + format ).replace( /{((`}|[^}])*)}+/g, fn );
	
	function fn( all, name )
	{
		var fn = df_fns[ name ];
		return fn ? fn( date ) : fsrch( name, args, 2, args.length, "" );
	}
};

var df_youbi = [ "日", "月", "火", "水", "木", "金", "土" ];

var df_fns = 
{
	YMD: function( date ) {  return df( "{YYYY}/{MM}/{DD}", date );  },
	YMDB: function( date ) {  return df( "{YYYY}/{MM}/{DD} ({B})", date );  },
	
	YYYY:  function( date )  {  return  "" + date.getFullYear();  },
	YY:  function( date )  {  return  ( "000" + date.getFullYear() ).substr( -2 );  },
	MM:  function( date )  {  return  ( "0" + ( date.getMonth() + 1 ) ).substr( -2 );  },
	DD:  function( date )  {  return  ( "0" + date.getDate() ).substr( -2 );  },
	B: function( date )  {  return  df_youbi[  date.getDay()  ];  },
	
	hms: function( date )  {  return df( "{hh}:{mm}:{ss}", date );  },
	
	hh:  function( date )  {  return  ( "0" + date.getHours() ).substr( -2 );  },
	h:  function( date )  {  return  "" + date.getHours();  },
	mm:  function( date )  {  return  ( "0" + date.getMinutes() ).substr( -2 );  },
	m:  function( date )  {  return  "" + date.getMinutes();  },
	ss:  function( date )  {  return  ( "0" + date.getSeconds() ).substr( -2 );  },
	s:  function( date )  {  return  "" + date.getSeconds();  },
	
	uYMD: function( date ) {  return df( "{uYYYY}/{uMM}/{uDD}", date );  },
	
	uYYYY:  function( date )  {  return  "" + date.getUTCFullYear();  },
	uYY:  function( date )  {  return  ( "000" + date.getUTCFullYear() ).substr( -2 );  },
	uMM:  function( date )  {  return  ( "0" + ( date.getUTCMonth() + 1 ) ).substr( -2 );  },
	uDD:  function( date )  {  return  ( "0" + date.getUTCDate() ).substr( -2 );  },
};
