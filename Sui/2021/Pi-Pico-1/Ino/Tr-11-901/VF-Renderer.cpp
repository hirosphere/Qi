#include "App.h"

const int16_t sin_table[ 256 ] =
{
	0, 402, 804, 1205, 1606, 2006, 2404, 2801, 3196, 3590, 3981, 4370, 4756, 5139, 5520, 5897, 6270, 6639, 7005, 7366, 7723, 8076, 8423, 8765, 9102, 9434, 9760, 10080, 10394, 10702, 11003, 11297, 11585, 11866, 12140, 12406, 12665, 12916, 13160, 13395, 13623, 13842, 14053, 14256, 14449, 14635, 14811, 14978, 15137, 15286, 15426, 15557, 15679, 15791, 15893, 15986, 16069, 16143, 16207, 16261, 16305, 16340, 16364, 16379, 16384, 16379, 16364, 16340, 16305, 16261, 16207, 16143, 16069, 15986, 15893, 15791, 15679, 15557, 15426, 15286, 15137, 14978, 14811, 14635, 14449, 14256, 14053, 13842, 13623, 13395, 13160, 12916, 12665, 12406, 12140, 11866, 11585, 11297, 11003, 10702, 10394, 10080, 9760, 9434, 9102, 8765, 8423, 8076, 7723, 7366, 7005, 6639, 6270, 5897, 5520, 5139, 4756, 4370, 3981, 3590, 3196, 2801, 2404, 2006, 1606, 1205, 804, 402, 0, -402, -804, -1205, -1606, -2006, -2404, -2801, -3196, -3590, -3981, -4370, -4756, -5139, -5520, -5897, -6270, -6639, -7005, -7366, -7723, -8076, -8423, -8765, -9102, -9434, -9760, -10080, -10394, -10702, -11003, -11297, -11585, -11866, -12140, -12406, -12665, -12916, -13160, -13395, -13623, -13842, -14053, -14256, -14449, -14635, -14811, -14978, -15137, -15286, -15426, -15557, -15679, -15791, -15893, -15986, -16069, -16143, -16207, -16261, -16305, -16340, -16364, -16379, -16384, -16379, -16364, -16340, -16305, -16261, -16207, -16143, -16069, -15986, -15893, -15791, -15679, -15557, -15426, -15286, -15137, -14978, -14811, -14635, -14449, -14256, -14053, -13842, -13623, -13395, -13160, -12916, -12665, -12406, -12140, -11866, -11585, -11297, -11003, -10702, -10394, -10080, -9760, -9434, -9102, -8765, -8423, -8076, -7723, -7366, -7005, -6639, -6270, -5897, -5520, -5139, -4756, -4370, -3981, -3590, -3196, -2801, -2404, -2006, -1606, -1205, -804, -402
};



typedef int32_t fix;

const int fix_shift = 14;
const fix fix_mag = 1 << fix_shift;

inline fix fix_fl( float v ) { return ( float ) fix_mag * v; }
inline fix fix_mul( fix a, fix b ) { return ( a * b ) >> fix_shift; }


static inline uint32_t ftos( float freq ) {  return freq * ( 65536.f / Canvas_Sample_Rate * 65536.f );  }



struct Osc
{
	Osc( float freq, float level = 1.f )
	{
		Freq( freq );
		this->level = fix_fl( level );
	}

	void Freq( float freq ) { step = ftos( freq ); }

	fix Sin()
	{
		fix wav = sin_table[ phase >> 24 ];
		phase += step;
		return fix_mul( wav, level );
	}

	fix level = fix_mag;
	uint32_t step = ftos( 440.f ), phase = 0;
};



//    //

struct Re1 : public Renderer
{
	Train & train;
	Osc vo1, mo1;

	Re1( Train * train, float freq ) :

		train( * train ),
		vo1( freq, PWM_Range / ( float ) fix_mag ),
		mo1( 0.25f )

	{}

	String Monitor() override
	{
		return String( vo1.step ) + " " + String( vo1.level );
	}

	void testput( int cmd, float v ) override
	{
		switch( cmd )
		{
			case 0:  vo1.level += 0x100;  break;
			case 1:  vo1.level -= 0x100;  break;
			case 2:  vo1.step += 0x10000;  break;
			case 3:  vo1.step -= 0x10000;  break;
		}
	}

	fix render1()
	{
		int32_t s = 16384;
		int32_t a = random( - s, s );
		int32_t b = random( - s, s );
		return ( a * b ) >> 14;
	}

	fix render2()
	{
		fix wav = vo1.Sin() + fix_fl( 0.0f );
		wav = fix_mul( wav, mo1.Sin() );
		return wav;
	}

	void Render( uint32_t * output ) override
	{
		vo1.Freq( train.tv1.value );
		int16_t mot_v = ( train.motor_voltage() / 12.f * PWM_Range );

		vo1.level = PWM_Range;

		for( int i = Canvas_Buffer_Size; i; i -- )
		{
			// pwm_i( output, fix_mul( render2(), ( fix ) PWM_Range ) );
			//pwm_i( output, mot_v + render2() );
			pwm_i( output, render1() );
		}
	}
};


//    //

class Re0 : public Renderer
{
 public:
	void Render( uint32_t * output )  override
	{
		int16_t volume = ( PWM_Range * ( phase - 0.5 ) * 2 );
		
		for( int i = Canvas_Buffer_Size; i --;  )
		{
			//pwm_v(  output, random( - 100, 100 ) * volume / 100 );
			pwm_i(  output, random( 0, 2 ) * volume );
			// pwm_i(  output, random( - PWM_Range, PWM_Range ) );
		}

		phase += ( 0.5f ) / Canvas_Render_Rate;
		if( phase > 1 )  phase -= 1;
	}

	float phase = 0;
};


//    //

Renderer * Create_Renderer( Train * train, int type, float a, float b, float c, float d )
{
	switch( type )
	{
		case 1:  return  new Re1( train, a );
		default:  return  new Re0();
	}
}
