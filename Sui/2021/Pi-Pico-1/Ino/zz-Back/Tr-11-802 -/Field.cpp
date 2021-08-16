#include "Field.h"

Fields::Fields( int field_len ) : field_len( field_len )
{
	fields = new Field * [ field_len ] {};
}

void Fields::Add( String name, Float & field, Float_Prof & prof )
{
	if( field_count >= field_len ) return;

	field.name = name;
	field.prof = & prof;
	field.value = prof.init;
	
	fields[ field_count ++ ] = & field;
}

String Fields::Full_String()
{
	String rt = "";
	for( int i = 0; i < field_count; i ++ )  rt = rt + fields[ i ]->Full_String() + "\n";
	return rt;
}

struct : public Field
{
	String Full_String() override { return "-- default field --"; };
}
def_field;

Field & Fields::Get( String name )
{
	for( int i = 0; i < field_count; i ++ )
	{
		Field * field = fields[ i ];
		if( field -> name == name )  return * field;
	}
	return def_field;
}

void Float_Prof::updown( float & value, int step_class )
{
	switch( step_class )
	{
		case 0:  value = init;  break;

		case 1:  value += steps[ 0 ];  break;
		case 2:  value += steps[ 1 ];  break;
		case 3:  value += steps[ 2 ];  break;
		case 4:  value += steps[ 3 ];  break;

		case -1:  value -= steps[ 0 ];  break;
		case -2:  value -= steps[ 1 ];  break;
		case -3:  value -= steps[ 2 ];  break;
		case -4:  value -= steps[ 3 ];  break;
	}

	value = ( value > max ? max : value < min ? min : value );
}

String Float::Full_String()
{
	return name + " : " + String( value ) +
	(
		prof != nullptr ? prof->unit + " ( " + String( prof->init ) + " )" : ""
	);
}
