#include "App.h"

typedef uint32_t u16f16;
u16f16 u16f16_( float value ) { return ( u16f16 ) ( value * 65536.f ); }
u16f16 u16f16_( uint32_t value ) { return value << 16; }
const u16f16 osc_phase_range = u16f16_( Sample_Rate );

class Osc
{
 public:

	Osc( float freq )
	{
		this->freq = u16f16_( freq );
	}

	int32_t Step( int32_t level )
	{
		int32_t rt = ( ( phase / Sample_Rate ) * level ) >> 16;
		if( ( phase += freq ) >= osc_phase_range )  phase -= osc_phase_range;
		return rt;
	}

	u16f16 freq, phase = 0;
};

class TestRenderer : public Renderer
{
 public:

	virtual void Render( uint32_t * output )
	{
		int c = Canvas_Buffer_Size;
		while( c -- )
		{
		//	osc_1.freq = u16f16_( sweep );
		//	pwm_v( output, osc_1.Step( PWM_Range ) );
		//	if( ( sweep += 1.f ) >= 880.f ) sweep = 220.f;
			
			// pwm_v( output, random( -PWM_Range, PWM_Range ) );
		}
	}

	Osc osc_1 = { 440.f };

	//float sweep = 220.f;
};



Renderer * Renderer::Create( int type )
{
	return new TestRenderer();
}
