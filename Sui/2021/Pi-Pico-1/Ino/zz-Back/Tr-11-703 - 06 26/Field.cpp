#include "Field.h"

Fields::Fields( int field_len ) : field_len( field_len )
{
	fields = new Field * [ field_len ] {};
}

void Fields::add( String name, Float & field, Float::Profile & profile )
{
	if( field_count >= field_len ) return;

	field.name = name;
	field.value = profile.init;
	field.profile = & profile;

	fields[ field_count ++ ] = & field;
}

struct : public Field
{
	String fullstring() override { return "-- default field --"; };
}
def_field;

Field & Fields::get( String name )
{
	for( int i = 0; i < field_count; i ++ )
	{
		Field * field = fields[ i ];
		if( field -> name == name )  return * field;
	}
	return def_field;
}

String Fields::fullstring()
{
	String rt = "";
	for( int i = 0; i < field_count; i ++ )  rt = rt + fields[ i ]->fullstring() + "\n";
	return rt;
}

