#include "App.h"
#include "arduino.h"

struct Test_Rend : public Renderer
{
	void Render( uint32_t * output, int len )
	{
		while( len -- )
		{
			* output ++ = random( - PWM_Range, PWM_Range );
		}
	}
};

Test_Rend trend;

void App::Setup()
{
	powers.Set_Renderer( 0, trend );
	powers.Set_Renderer( 1, trend );

	powers.Select_Output_Source( 0, 0 );
	powers.Select_Output_Source( 1, 1 );

	powers.Init_Output( 0, 0 );
	powers.Init_Output( 1, 2, :: ISR_DMA_Tick );

	powers.Trigger_PWMs();
	powers.Trigger_DMAs();
	powers.Render();
}

void App::Loop()
{
	;
}

void App::ISR_DMA_Tick()
{
	powers.Trigger_DMAs();
	powers.Render();
	powers.Clear_DMA_IRQ();
}
