#ifndef _FIELD_H_
#define _FIELD_H_

#include <arduino.h>

//    //

struct Field
{
	String name;

	virtual String fullstring() = 0;
	virtual void updown( int step_class ) {};
};

template < typename type > struct Typed_Field : public Field
{
	struct Profile
	{
		String unit;
		type init, min, max, steps[ 4 ];

		void updown( type & value, int step_class )
		{
			switch( step_class )
			{
				case 0: value = init; break;

				case 1: value += steps[ 0 ]; break;
				case 2: value += steps[ 1 ]; break;
				case 3: value += steps[ 2 ]; break;
				case 4: value += steps[ 3 ]; break;

				case -1: value -= steps[ 0 ]; break;
				case -2: value -= steps[ 1 ]; break;
				case -3: value -= steps[ 2 ]; break;
				case -4: value -= steps[ 3 ]; break;
			}

			if( value < min )  value = min; else if( value > max ) value = max;
		}
	};

	type value;
	Profile * profile = nullptr;

	void updown( int step_class )
	{
		if( profile ) profile->updown( value, step_class );
	}

	String fullstring()
	{
		return name + " : " + String( value ) + ( profile ? profile->unit : "" );
	}
};

using Float = Typed_Field < float >;


struct Fields
{
	Fields( int field_len );

	void add( String name, Float & field, Float::Profile & profile );
	struct Field & get( String name );
	String fullstring();
	
 protected:

	Field ** fields;
	int field_len;
	int field_count = 0;
};

#endif
