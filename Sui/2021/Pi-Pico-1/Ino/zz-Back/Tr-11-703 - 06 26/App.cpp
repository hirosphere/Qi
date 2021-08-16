#include "App.h"
#include "arduino.h"

void App::Setup()
{
	
	for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Init();

	powers.Set_Renderer( 0, trains[ 0 ] );
	powers.Set_Renderer( 1, trains[ 1 ] );
	powers.Set_Renderer( 2, trains[ 2 ] );
	powers.Set_Renderer( 3, trains[ 3 ] );

	powers.Select_Output_Source( 0, 0 );
	powers.Select_Output_Source( 1, 0 );
	powers.Select_Output_Source( 2, 1 );
	powers.Select_Output_Source( 3, 1 );

	powers.Init_Output( 0, 0 );
	powers.Init_Output( 1, 2 );
	powers.Init_Output( 2, 4 );
	powers.Init_Output( 3, 6, :: ISR_DMA_Tick );

	powers.Trigger_PWMs();
	
	powers.Trigger_DMAs();
	powers.Render();

	prev_millis = millis();
}

void App::Loop()
{
	usb_mon.Tick();
}

void App::ISR_DMA_Tick()
{
	powers.Trigger_DMAs();
	powers.Render();
	powers.Clear_DMA_IRQ();
}
