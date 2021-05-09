#include "App.h"

void Gl_Next_DMA();

class App_Impl : public App
{
 public:

	void Init()
	{
		trains[ 0 ].Init( 100.f, 3.3f, 70.f, 4.f, 3.f );
		trains[ 1 ].Init( 300.f, 3.0f, 80.f, 4.f, 4.f );
		trains[ 2 ].Init( 1050.f, 2.2f, 120.f, 6.f, 6.f );
		trains[ 3 ].Init( 600.f, 1.2f, 120.f, 8.f, 8.f );

		canvas.Set_Renderer( 0, & trains[ 0 ] );
		canvas.Set_Renderer( 1, & trains[ 1 ] );
		canvas.Set_Renderer( 2, & trains[ 2 ] );
		canvas.Set_Renderer( 3, & trains[ 3 ] );
		
		pwm_channels[ 0 ].Init( 0, & canvas );
		pwm_channels[ 1 ].Init( 2, & canvas );
		pwm_channels[ 2 ].Init( 4, & canvas );
		pwm_channels[ 3 ].Init( 6, & canvas, Gl_Next_DMA );

		PWM_Channel::Start_Slices();

		//pwm_channels[ 0 ].Test();
		//pwm_channels[ 1 ].Test();
		//pwm_channels[ 2 ].Test();
		//pwm_channels[ 3 ].Test();
		
		//delay( 250 );
		
		pwm_channels[ 0 ].Select_Source( 0 );
		pwm_channels[ 1 ].Select_Source( 1 );
		pwm_channels[ 2 ].Select_Source( 2 );
		pwm_channels[ 3 ].Select_Source( 3 );

		PWM_Channel::Start_DMA();
		canvas.Next();

		usb_sm.Init( this, & Serial, Serial_Addr );
	}

	uint32_t mon_prev = 0;
	int mon_phase = 0;
	int mon_ctr = 0;

	void Loop()
	{
		if( render_request )
		{
			render_request = false;
			Tick();
		}

		uint32_t cur = millis();
		if( ( cur - mon_prev ) >= 1000 )
		{
			mon_prev = cur;
			dma_tick_mon = 0;
			render_count = 0;
		}

		else return;

		int anch = random( 4 );
		int pwch = random( PWM_Ch_Count );
		//pwm_channels[ pwch ].Select_Source( anch );

	}

	void Tick()
	{
		usb_sm.Tick();

		for( int i = 0; i < Train_Count; i ++ ) trains[ i ].Tick();
		
		canvas.Render();
		
		render_count ++;
	}

	void isr_Next_DMA()
	{
		PWM_Channel::Clear_IRQ();
		dma_tick_mon ++;
		
		int cur = canvas.Cur_Index();
		for( int i = 0; i < PWM_Ch_Count; i ++ )
		{
			pwm_channels[ i ].Next_DMA( cur );
		}

		canvas.Next();		
		render_request = true;
		PWM_Channel::Start_DMA();
	}

 protected:

	Serial_Monitor usb_sm;
	// Serial_Monitor uart_sm;

	bool render_request = false;
	uint32_t dma_tick_mon = 0;
	uint32_t render_count = 0;
};

App_Impl app;

void setup()
{
	Serial.begin( 115200 );
	delay( 500 );
	Serial.println( "Train-11" );
	app.Init();
}

void Gl_Next_DMA()
{
	app.isr_Next_DMA();
}

void loop()
{
	app.Loop();
}
