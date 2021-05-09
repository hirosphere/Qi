#include "App.h"

const float sf_rate = ( 65536.f / Sample_Rate ) * 65536.f;

class Osc
{
 public:

	inline void Freq( float freq ) {  this->step = ( uint32_t ) ( freq * sf_rate );  }

	inline int32_t Saw( int32_t level )
	{
		int32_t rt = ( level * ( ( int32_t ) ( phase >> 15 ) - 65536 ) ) >> 16;
		phase += step;
		return rt;
	}

	uint32_t step, phase = 0;
};

class T3 : public Renderer
{
 public:

	T3( Train * train, float freq )
	{
		this->train = train;
		Osc1.Freq( freq );
	}

	virtual void Render( uint32_t * output )
	{
		int c = Canvas_Buffer_Size;

		int32_t voltage = ( train->forward ? 1 : -1 ) *
		(
			( float ) PWM_Range * ( train->voltage / 12.f )
		);

		float acc_vol = ( train->acc / 3.f );

		int32_t o1_level = pwm_vol( 0.06f );
		int32_t o2_level = pwm_vol( 0.04f * acc_vol );
		int32_t o3_level = pwm_vol( 0.04f );

		float mot_hz = train->speed * 0.6f;
		Osc1.Freq( mot_hz * 2 );
		Osc2.Freq( mot_hz * 15 );
		Osc3.Freq( mot_hz * 12 );

		while( c -- )
		{
			int32_t sample =
				voltage +
				Osc1.Saw( o1_level ) +
				Osc2.Saw( o2_level ) +
				Osc3.Saw( o3_level )
			;
			pwm_i( output, sample );
		}
	}

	inline int32_t pwm_vol( float volume )
	{
		volume = volume > 1.f ? 1.f : ( volume < -1.f ? -1.f : volume );
		float gain = train->speed == 0.f ? 0.f : ( float ) ( train->forward ? PWM_Range : - PWM_Range );
		return ( uint32_t ) ( volume * gain );
	}

	Train * train;
	Osc Osc1, Osc2, Osc3;
};

Renderer * Renderer::Create_T3( Train * train, float freq ) {  return new T3( train, freq );  }

