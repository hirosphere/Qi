#ifndef _601_11_H_
#define _601_11_H_

#include <iostream>
typedef std::string  String;


struct Field
{
	inline Field( String name ) : name( name ) {}
	String name;
	virtual String Full_String() = 0;
	virtual void Up_Down( int step_class ) = 0;
};

struct Float_Prof
{
	String unit;
	float init , min , max , steps[ 4 ];

	void value_oper( float & value, int step_class );
	String value_string( float & value );
};

struct Float : public Field
{
	Float( String name, Float_Prof & prof ) : Field( name ), prof( prof )
	{
		value = prof.init;
	}

	String Full_String()  override;
	virtual void Up_Down( int step_class )  override;

	float value;
	Float_Prof & prof;
};

//    //

struct Train
{
	Float  idle,  bias,  max,  cv;

	Train();

	typedef enum { Idle, Bias, Max, CV, Index_Count } index_t;
	Field * items[ Index_Count ];

	Field & Get_Field( String name );
};

//    //

struct KSO { virtual void key_stroke( char key ) = 0; };


#endif
