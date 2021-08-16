#include "App.h"

//    //

using fix = int16_t;

const fix  fix_shift = 12;
const fix  fix_1 = 1 << fix_shift;
const fix  fix_2 = fix_1 * 2;

inline fix fix_f( float value ) { return  value * ( float ) fix_1; }
inline fix fix_mul( fix a, fix b ) { return ( ( uint32_t ) a * ( uint32_t ) b ) >> fix_shift; }

//    //

fix sin_table[ 256 ] = { 0, 101, 201, 301, 401, 501, 601, 700, 799, 897, 995, 1092, 1189, 1285, 1380, 1474, 1567, 1660, 1751, 1842, 1931, 2019, 2106, 2191, 2276, 2359, 2440, 2520, 2598, 2675, 2751, 2824, 2896, 2967, 3035, 3102, 3166, 3229, 3290, 3349, 3406, 3461, 3513, 3564, 3612, 3659, 3703, 3745, 3784, 3822, 3857, 3889, 3920, 3948, 3973, 3996, 4017, 4036, 4052, 4065, 4076, 4085, 4091, 4095, 4096, 4095, 4091, 4085, 4076, 4065, 4052, 4036, 4017, 3996, 3973, 3948, 3920, 3889, 3857, 3822, 3784, 3745, 3703, 3659, 3612, 3564, 3513, 3461, 3406, 3349, 3290, 3229, 3166, 3102, 3035, 2967, 2896, 2824, 2751, 2675, 2598, 2520, 2440, 2359, 2276, 2191, 2106, 2019, 1931, 1842, 1751, 1660, 1567, 1474, 1380, 1285, 1189, 1092, 995, 897, 799, 700, 601, 501, 401, 301, 201, 101, 0, -101, -201, -301, -401, -501, -601, -700, -799, -897, -995, -1092, -1189, -1285, -1380, -1474, -1567, -1660, -1751, -1842, -1931, -2019, -2106, -2191, -2276, -2359, -2440, -2520, -2598, -2675, -2751, -2824, -2896, -2967, -3035, -3102, -3166, -3229, -3290, -3349, -3406, -3461, -3513, -3564, -3612, -3659, -3703, -3745, -3784, -3822, -3857, -3889, -3920, -3948, -3973, -3996, -4017, -4036, -4052, -4065, -4076, -4085, -4091, -4095, -4096, -4095, -4091, -4085, -4076, -4065, -4052, -4036, -4017, -3996, -3973, -3948, -3920, -3889, -3857, -3822, -3784, -3745, -3703, -3659, -3612, -3564, -3513, -3461, -3406, -3349, -3290, -3229, -3166, -3102, -3035, -2967, -2896, -2824, -2751, -2675, -2598, -2520, -2440, -2359, -2276, -2191, -2106, -2019, -1931, -1842, -1751, -1660, -1567, -1474, -1380, -1285, -1189, -1092, -995, -897, -799, -700, -601, -501, -401, -301, -201, -101 };


uint32_t ftos( float freq ) {  return ( freq * 0x100000000 / Sample_Rate );  }


struct Osc
{
	Osc( float freq = 440.f, float level = 1.f )
	{
		Freq( freq );
		Level( level );
	}

	void Freq( float freq ) { this->step = ftos( freq ); }
	void Level( float value ) { this->level = fix_f( value ); }

	fix Sin()
	{
		fix wave = sin_table[ phase >> 24 ];
		phase += step;
		return fix_mul( wave, level );
	}

	fix level;
	uint32_t step, phase = 0;
};

struct PWM
{
	inline void Carr_Freq( float freq )
	{
		carr_step = ftos( freq );
		mag = fix_f( Sample_Rate / freq );
	}

	inline void Width( float value ) {  bias = fix_f( value );  }
	inline void Volume( float value ) { volume = ( fix ) ( value * PWM_Range_f ); }

	inline fix Carr1()
	{
		fix saw = ( fix ) ( carr_phase >> ( 32 - 13 ) ) - fix_1;		
		carr_phase += carr_step;
		return fix_mul( saw + bias, volume );
	}

	inline fix Carr2()
	{
		fix saw_2 = ( fix ) ( carr_phase >> ( 32 - 14 ) ) - fix_1;		
		carr_phase += carr_step;
		fix tri = saw_2 < fix_1 ? saw_2 : fix_2 - saw_2; 
		return fix_mul( tri + bias, volume );
	}

	fix volume = 0, bias = 0, mag = fix_1;
	uint32_t carr_step, carr_phase = 0;
};


//    //

inline float volclip( float volume, float voltage )
{
	float over = volume + voltage - 1;
	if( over > 0.f ) return volume - ( over );
	return volume;
}

struct WG2 : Wave_Gen
{
	void Render( Train & train, Powers::Writer output )  override
	{
		pwm.Volume( 1.f );
		pwm.Carr_Freq( train.Freq.value );
		pwm.Width( train.Width.value / 100.f );

		switch( ( int ) train.Param_1.value )
		{
			default:
			case 0:    while( output )  output = pwm.Carr1();    break;
			case 1:    while( output )  output = pwm.Carr2();    break;
		}

		
	}
	PWM pwm;
};

struct WG1 : Wave_Gen
{
	void Render( Train & train, Powers::Writer output )  override
	{
		osc.Level( train.Width.value / 100.f );
		osc.Freq( train.Freq.value );
		while( output )  output = osc.Sin();
	}
	Osc osc;
};

struct WG0 : Wave_Gen
{
	void Render( Train & train, Powers::Writer output )  override
	{
		int16_t volt = ( train.voltage() / 12.f * PWM_Range_f );
		while( output ) output = random( 0, volt );
	}
};


//    //

Wave_Gen * Test_WG( int i )
{
	switch( i )
	{
		case 0: return new WG0(); break;
		case 1: return new WG1(); break;
		case 2: return new WG2(); break;
	}
	return nullptr;
}
