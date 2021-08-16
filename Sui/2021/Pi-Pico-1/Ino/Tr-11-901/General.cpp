#include "General.h"

//  Field(s)  //

	//    //

void Float_Prof::value_oper( float & value, int step_class )
{
	if( step_class == 0 ) { value = init; return; }
	if( step_class > 0 )  value += steps[ step_class - 1 ];
	else                  value -= steps[ -1 - step_class ];

	if( value > max ) value = max; else if( value < min ) value = min;
}

String Float_Prof::value_string( float & value )
{
	return String( value ) + unit;
}

	//    //

String Float::Full_String()
{
	return name + " " + prof.value_string( value );
}

void Float::Up_Down( int step_class ) {  prof.value_oper( value, step_class );  }






//  class Serial_Monitor  //

void Serial_Monitor::Tick()
{
	while( stream.available() )
	{
		char ch = stream.read();
		if( ch == '\n' )  on_enter();
		else if(  is_current  &&  line_buffer.length() == 0  &&  ! ( ch == '@' || ch == '-' ) )
		{
			stream.println( " - @" + addr + "" + key_client->Act( ch ) );
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
		stream.println(  "@" + addr + " > " + line_client->Act( words )  );
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
