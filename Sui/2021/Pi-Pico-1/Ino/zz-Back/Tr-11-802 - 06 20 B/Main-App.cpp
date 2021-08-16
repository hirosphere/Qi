#include "App.h"

inline void pwm_i( uint32_t *& output, int16_t value )
{
	uint32_t a, b;
	
	if( value >= 0 ) { a = value; b = 0; }
	else             { b = value; a = 0; }

	* output ++ = ( b << 16 | a );
}

struct Rend : public Renderer
{
	bool f = true;
	void Render( uint32_t * output, int len )  override
	{
		int16_t v = random( - PWM_Range, PWM_Range );
		while( len -- )
		{
			//  pwm_i( output, f ? PWM_Range : - PWM_Range ); f = ! f;
			//  pwm_i( output, random( - PWM_Range, PWM_Range ) );
			pwm_i( output, v );
		}
	}
};

Rend test_rend[ 4 ];

void Main_App::Setup()
{
	for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Init();

	canvas.Set_Renderer( 0, test_rend[ 0 ] );
	canvas.Set_Renderer( 1, test_rend[ 1 ] );
	canvas.Set_Renderer( 2, test_rend[ 2 ] );
	canvas.Set_Renderer( 3, test_rend[ 3 ] );
	
	powers.Init_Periph( 0, 0 );
	powers.Init_Periph( 1, 2 );
	powers.Init_Periph( 2, 4 );
	powers.Init_Periph( 3, 6 );
	
	powers.Select_Source( 0, 0 );
	powers.Select_Source( 1, 1 );
	powers.Select_Source( 2, 2 );
	powers.Select_Source( 3, 3 );
	
	powers.Start_PWMs();
	//powers.Trigger_DMAs();
}

void Main_App::Loop()
{
	usb_mon.Tick();
}

void Main_App::ISR_Tick()
{
	//powers.Trigger_DMAs();
}

static Main_App main_app;

App & App::Get_Main_App() { return main_app; }
