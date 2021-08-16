#ifndef _SERIAL_MONITOR_
#define _SERIAL_MONITOR_

#include "arduino.h"

//    //

class Word_Reader
{
 public:

	inline Word_Reader( String str ) : str( str ) {}
	inline bool Has_Next()  {  return pos < str.length();  }
	float Next_Float( float failval = 0.f );
	String Next();

	char Next_Char();
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

	bool is_current = true;
	String line_buffer = "";

 private:

	void on_enter();

};

#endif
