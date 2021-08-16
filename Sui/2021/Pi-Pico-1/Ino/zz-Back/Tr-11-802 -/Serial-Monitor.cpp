#include "Serial-Monitor.h"


//  class Serial_Monitor  //

void Serial_Monitor::Tick()
{
	while( stream.available() )
	{
		char ch = stream.read();
		if( ch == '\n' )  on_enter();
		else if(  is_current  &&  line_buffer.length() == 0  &&  ! ( ch == '@' || ch == '-' ) )
		{
			stream.println
			(
				" - @" + addr + " "
				+ ( key_client != nullptr ? key_client->Act( ch ) : "." )
			);
		}
		else  line_buffer += ch;

	}

}

void Serial_Monitor::on_enter()
{
	Word_Reader words( line_buffer );

	char ch = words.Next_Char();
	if( ch == '@' )  is_current = words.Next() == addr;
	
	if( is_current )
	{
		stream.println
		(
			"@" + addr + " > "
			+ ( line_client != nullptr ? line_client->Act( words ) : "..." )
		);
	}

	line_buffer = "";
}


//  class  Word_Reader  //

String Word_Reader::Next()
{
	if( pos >= str.length() )  return "";

	int begin = pos;
	int end = str.indexOf( ' ', begin );
	if( end < begin ) end = str.length();
	pos = end + 1;

	return str.substring( begin, end );
}

char Word_Reader::Next_Char()
{
	return pos < str.length() ? str[ pos ++ ] : '\0';
}

