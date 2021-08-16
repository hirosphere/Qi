#ifndef _FIELD_H_
#define _FIELD_H_

#include <arduino.h>

struct Field
{
	String name;
	virtual String Full_String() = 0;
	virtual void Up_Down( int step_class ) {};
};


struct Fields
{
	Fields( int field_len );
	void Add( String name, struct Float & field, struct Float_Prof & prof );
	Field & Get( String name );
	String Full_String();
	
 protected:

	Field ** fields = NULL;
	int field_len;
	int field_count = 0;
};


struct Float_Prof
{
	String unit;
	float min, max, init = 8.888f;
	float steps[ 4 ];

	void updown( float & value, int step_class );
};

struct Float : public Field
{
	String Full_String() override;
	inline void Up_Down( int step_class )  override { if( prof ) prof->updown( value, step_class ); }

	float value = 7.777f;
	Float_Prof * prof = nullptr;
};


#endif
