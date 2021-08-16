#include "arduino.h"

String::String( const float value, int frac )
{
	std::stringstream stream;
	stream << std::fixed << std::setprecision( 2 ) << value;
	this->value = stream.str();
}