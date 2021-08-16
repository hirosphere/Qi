#ifndef _ARDUINO_H_
#define _ARDUINO_H_

#include <iostream>
#include <sstream>
#include <iomanip>

class String
{
 public:

	inline String( const char * value = "" ) : value( std::string( value ) ) {}
	inline String( const std::string value ) : value( value ) {}
	String( const float value, int frac = 2 );
	


	friend String operator + ( const String & a, const String & b )
	{
		return String( a.value + b.value );
	}

	friend String operator + ( const String & a, const char * b )
	{
		return String( a.value + std::string( b ) );
	}

	friend bool operator == ( const String & a, const String & b )
	{
		return a.value == b.value;
	}

	friend std::ostream & operator << ( std::ostream & output, const String & me )
	{
		return output << me.value;
	}

 protected:

	std::string value;
};

#endif
