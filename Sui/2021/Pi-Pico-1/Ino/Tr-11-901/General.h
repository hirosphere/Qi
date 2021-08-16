#ifndef _GENERAL_H_
#define _GENERAL_H_

#include "arduino.h"


//  Field(s)  //

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
	inline Float( String name, Float_Prof & prof ) : Field( name ), prof( prof )
	{
		value = prof.init;
	}

	String Full_String()  override;
	virtual void Up_Down( int step_class )  override;

	float value;
	Float_Prof & prof;
};

//    //

class Word_Reader
{
 public:

	inline Word_Reader( String str ) : str( str ) {}
	inline bool Has_Next()  {  return pos < str.length();  }
	char Next_Char();
	String Next();

	uint32_t pos = 0; String str;
};



//    //


class Serial_Monitor
{
 public:

	struct Line_Client {  virtual String Act( Word_Reader & words ) = 0;  };
	struct Key_Client {  virtual String Act( char key ) = 0;  };
	
	inline Serial_Monitor( String addr, Stream & stream, Line_Client * line_client, Key_Client * key_client )  : addr( addr ), stream( stream ), key_client( key_client ), line_client( line_client ) {}
	
	void Tick();

 protected:

	Line_Client * line_client = NULL;
	Key_Client * key_client = NULL;

	String addr;
	Stream & stream;

	bool is_current = false;
	String line_buffer = "";

 private:

	void on_enter();

};

#endif
