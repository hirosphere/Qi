
#include <cstdlib>
#include <iostream>
#include <stdint.h>

const float Sample_Rate = 34482.75862068966f;   //  125MHz / 3625 = 34.483kHz  //

using fix = int32_t;
const int fix_shift = 12;
const fix fix_1 = 1 << fix_shift;
const fix fix_2 = fix_1 * 2;

uint32_t ftos( float freq ) {  return ( freq * 0x100000000 / Sample_Rate );  }

class Carr_Osc
{
 public:

	void freq( float f ) { step = ftos( f ); }

	void sample()
	{
		fix saw = ( phase >> ( - ( fix_shift + 2 ) + 32 ) ) - fix_1;
		phase += step;
		fix tri = ( saw < fix_1 ? saw : fix_2 - saw );
		mon( saw, tri );
	}

	uint32_t step = 0, phase = 0, ser = 0;

	void test( float freq, int ct )
	{
		this->freq( freq );
		std::cout << "freq " << freq << "Hz"
		<< "\t" << "step " << ( step >> 16 )
		<< "\n";

		ser = 0;
		for( int i = 0; i < ct + 2; i ++ )  sample();

	}

	void mon( fix p1, fix p2 )
	{
		std::cout
			<< "\t" << ser ++
			<< "\t" << ( phase >> 16 )
			<< "\t" << p1
			<< "\t" << p2
			<< "\n"
		;
	}
};

int main()
{
	std::cout << "\nqst-1 ..\n\n";

	std::cout << "UINT32_MAX : " << UINT32_MAX << "\n";
	std::cout << "Sample_Rate : " << Sample_Rate << "\n";

	Carr_Osc crr;
	//crr.test( 344.82f, 100 );
	//crr.test( 2000.f, 18 );

	std::cout << std::hex << 0xFFFFFFFF << "\n";
	std::cout << std::hex << ( UINT32_MAX << 10 ) << "\n";

	std::cout << "\n";
}

