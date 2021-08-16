#include "App.h"

void Seq::Set_Schedule( String sch )
{
	schedule = sch;
	pos = 0;
}

static inline void empscan( String str, int & pos )
{
	while( pos < str.length() )
	{
		char ch = str.charAt( pos );
		if( ch == ' ' || ch == '\t' ) pos ++;
		else break;
	}
}

static String next_cmd( String sch, int & pos )
{
	empscan( sch, pos );

	int beg = pos;
	while( true )
	{
		if( pos >= sch.length() ) return sch.substring( beg );

		char ch = sch.charAt( pos ++ );
		if( ch == ',' ) return sch.substring( beg, pos - 1 );
	}

	return "";
}

void Seq::Tick( int32_t tick_ms )
{
	if( ( timeout -= tick_ms ) > 0 )  return;

	int limit = 100;
	while( timeout <= 0 && limit -- )
	{
		Word_Reader cmd( next_cmd( schedule, pos ) );
		if( ! cmd.Has_Next() )  { pos = 0; return; }

		do_command( cmd );
	}
}

void Seq::do_command( Word_Reader & cmd )
{
	String w0 = cmd.Next();
	
	if( w0 == "W" )
	{
		timeout += 1000;
		String w1 = cmd.Next();
		float time = w1.toFloat();
		timeout += ( int32_t ) ( time * 1000 );
		if( test >= 0 )  Serial.println( String( "Seq " + String( test ) ) + " " +  String( pos ) + " " + w0 + " " + String( time ) );
	
		return;
	}

	if( test >= 0 )  Serial.println( String( "Seq " + String( test ) ) + " " +  String( pos ) + " " + w0 );
}
