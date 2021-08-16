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
	int limit = 100;
	while( seq_is_timeout && limit -- )
	{
		Word_Reader cmd( next_cmd( schedule, pos ) );
		if( ! cmd.Has_Next() )  { pos = 0;  continue; }

		seq_act( cmd );
	}
}
