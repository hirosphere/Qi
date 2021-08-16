#include "App.h"

using fix = int16_t;

const fix  fix_shift = 12;
const fix  fix_1 = 1 << fix_shift;

inline fix fix_mul( fix a, fix b ) { return ( a * b ) >> fix_shift; }


void Train::WG1::Render( Train & train, Powers::Writer output )
{
	int16_t volt = ( train.voltage() / 12.f * PWM_Range_f );
	while( output )
	{
		output = fix_mul( volt, random( 0, fix_1 ) );
	}
}

