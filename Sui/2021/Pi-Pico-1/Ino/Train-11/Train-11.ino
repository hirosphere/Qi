#include "App.h"

#include "App.h"

void Gl_Next_DMA();

class App
{
 public:

	void Init()
	{
		test_renderer = Renderer::Create( 1 );

		pwm_channels[ 0 ].Init( 0, & canvas );
		pwm_channels[ 1 ].Init( 2, & canvas, Gl_Next_DMA );

		delay( 500 );
		
		pwm_channels[ 0 ].SelectSource( 0 );
		pwm_channels[ 1 ].SelectSource( 0 );

		PWM_Channel::Start_DMA();
	}

	void Render()
	{
		test_renderer->Render( canvas.Get_Buffer( 0 ) );
	}

	uint32_t mon_prev = 0;
	int mon_phase = 0;

	void Tick()
	{
		if( render_request )
		{
			render_request = false;
			Render();
		}

		uint32_t cur = millis();
		if( ( cur - mon_prev ) >= 1000 )
		{
			mon_prev = cur;
			Serial.println( String( PWM_Channel::dma_ch_mask ) + " - " + String( dma_tick_mon ) );
			dma_tick_mon = 0;
		}

		else return;

	}

	void isr_Next_DMA()
	{
		dma_tick_mon ++;
		
		int cur = canvas.Cur_Index();
		for( int i = 0; i < PWM_Ch_Count; i ++ )
		{
			pwm_channels[ i ].Next_DMA( cur );
		}

		canvas.Next();		
		render_request = true;
		PWM_Channel::Clear_IRQ();
	}

 protected:

	WaveCanvas canvas;
	PWM_Channel pwm_channels[ PWM_Ch_Count ];

	bool render_request = false;
	Renderer * test_renderer;
	uint32_t dma_tick_mon = 0;
};

App app;

void setup()
{
	Serial.begin( 115200 );
	Serial.println( "Train-11" );
	app.Init();
}

void Gl_Next_DMA()
{
	app.isr_Next_DMA();
}

void loop()
{
	app.Tick();
	delay( Tick_Time );
}
