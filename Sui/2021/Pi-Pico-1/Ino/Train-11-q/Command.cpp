#include "App.h"

class reader
{
 public:
	reader( String str ) { this->str = str; }

	bool next( String & out )
	{
		if( p >= str.length() )  return false;

		int begin = p;
		int end = str.indexOf( ' ', begin );
		if( end < begin ) end = str.length();
		p = end + 1;
		out = str.substring( begin, end );

		return true;
	}

	int p = 0; String str;
};

void Serial_Monitor::Init( App * app, Stream * stream, String addr )
{
	this->app = app;
	this->stream = stream;
	this->raddr = "@" + addr;
}

void Serial_Monitor::curr_res()
{
	;
}

void Serial_Monitor::mon_res()
{
	;
}

void Serial_Monitor::Tick()
{
	bool lncomp = false;
	char ch;
	while( stream->available() )
	{
		ch = stream->read();
		if( ch == '\n' )  { lncomp = true; break; }
		
		if( buff.length() == 0 && is_current && ! ( ch == '@' || ch == ':' ) )
			onkeystroke( ch );
		else
			buff += ch;
	}

	if( ! lncomp ) return;

	if( buff.substring( 4 ).compareTo( "@@@@" ) == 0 )
	{
		stream->println( buff );
	}

	reader rd( buff ), t( buff );
	buff = "";
	String word;

	if( buff.charAt( 0 ) == '@' && rd.next( word ) )  is_current = word.compareTo( raddr ) == 0;
	if( ! is_current )  return;

	for( int n = 1; t.next( word ) ; n ++ )  stream->println( String( n ) + " " + word );
	stream->println( String( raddr ) + " - is_current: " + String( is_current ) );
}



//  キーストローク操作処理  //


static String ks_props[] = { "電圧", "停止時電圧", "基底電圧", "頂圧速度", "速度", "指令加速度", "目標速度" };
static String ks_units[] = { "V", "V", "V", "km/h", "km/h", "km/h/s", "km/h" };


static void vop( float * value, float min, float max, char key, float A, float a, float b, float B, bool reset = false )
{
	float & v = * value;
	switch( key )
	{
		case 'Z' :  v -= A;  break;
		case 'X' :  v += A;  break;
		case 'z' :  v -= a;  break;
		case 'x' :  v += a;  break;
		case 'c' :  v -= b;  break;
		case 'v' :  v += b;  break;
		case 'C' :  v -= B;  break;
		case 'V' :  v += B;  break;
		case 'b' :  if( reset )  v = 0.f  ;  break;
	}
	if( v > max )  v = max;  else if( v < min )  v = min;
}

void Serial_Monitor::onkeystroke( char key )
{
	Train * train = & app->trains[ ks_Curr_train ];

	switch( key )
	{
		case 'q':  ks_Curr_train = 0;  break;
		case 'w':  ks_Curr_train = 1;  break;
		case 'e':  ks_Curr_train = 2;  break;
		case 'r':  ks_Curr_train = 3;  break;
		case 't':  ks_Curr_train = 4;  break;
		case 'y':  ks_Curr_train = 5;  break;
		case 'u':  ks_Curr_train = 6;  break;
		case 'i':  ks_Curr_train = 7;  break;

		case 'a':  ks_curr_prop = 0;  break;
		case 's':  ks_curr_prop = 1;  break;
		case 'd':  ks_curr_prop = 2;  break;
		case 'f':  ks_curr_prop = 3;  break;
		case 'g':  ks_curr_prop = 4;  break;
		case 'h':  ks_curr_prop = 5;  break;
		case 'j':  ks_curr_prop = 6;  break;

		case '/':  train->forward = true;  break;
		case '\\':  train->forward = false;  break;
	}

	float * value;

	switch( ks_curr_prop )
	{
		case 0:  vop( value = & train->voltage,	0.f, 12.f, key,   0.05, 0.1f, 0.5f, 1.0f );  break;
		case 1:  vop( value = & train->idle,	0.f, 12.f, key,   0.05, 0.1f, 0.5f, 1.0f );  break;
		case 2:  vop( value = & train->bias,	0.f, 12.f, key,   0.05, 0.1f, 0.5f, 1.0f );  break;
		case 3:  vop( value = & train->max,		0.f, 700.f, key,  0.5f, 1.f, 10.f, 20.f );  break;
		case 4:  vop( value = & train->speed,	0.f, 700.f, key,  0.1f, 1.f, 5.f, 10.f );  break;
		case 5:  vop( value = & train->act,		-50.f, 50.f, key, 0.1f, 0.5f, 1.0f, 5.f, true );  break;
		case 6:  vop( value = & train->target,	0.f, 700.f, key,  0.1f, 1.f, 5.f, 10.f );  break;
	}

	stream->println
	(
		"  " + raddr + "  " +
		"列車" + String( ks_Curr_train ) + "  " +
		
		ks_props[ ks_curr_prop ] + "" +
		* value + "" +
		ks_units[ ks_curr_prop ] +

		"  " +
		( train->forward ? "<-" : "->" ) + "  " +
		String( train->voltage ) + "V  " +
		String( train->speed ) + "km/h  " +
		String( train->acc ) + "km/h/s" +
		+ "" +
		""
	);
}

