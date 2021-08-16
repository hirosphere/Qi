#include "App.h"
#include "arduino.h"

String App::monitor_string()
{
	String rt = " ";

	rt += "DMAs : "; for( int i = 0; i < Output_Count; i++ ) rt += String( powers.output[ i ].dma_ch ) + " "; rt += "\n";

	return rt;
}

void App::Setup()
{
	
	for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Init();

	powers.Set_Renderer( 0, trains[ 0 ] );
	powers.Set_Renderer( 1, trains[ 1 ] );
	powers.Set_Renderer( 2, trains[ 2 ] );
	powers.Set_Renderer( 3, trains[ 3 ] );
	powers.Set_Renderer( 4, trains[ 4 ] );
	powers.Set_Renderer( 5, trains[ 5 ] );
	powers.Set_Renderer( 6, trains[ 6 ] );
	powers.Set_Renderer( 7, trains[ 7 ] );

	powers.Select_Output_Source( 0, 0 );
	powers.Select_Output_Source( 1, 1 );
	powers.Select_Output_Source( 2, 2 );
	powers.Select_Output_Source( 3, 3 );
	powers.Select_Output_Source( 4, 4 );
	powers.Select_Output_Source( 5, 5 );
	powers.Select_Output_Source( 6, 6 );
	powers.Select_Output_Source( 7, 7 );

	powers.Init_Output( 0, 0 );
	powers.Init_Output( 1, 2 );
	powers.Init_Output( 2, 4 );
	powers.Init_Output( 3, 6 );
	powers.Init_Output( 4, 8 );
	powers.Init_Output( 5, 10 );
	powers.Init_Output( 6, 12 );
	powers.Init_Output( 7, 14, :: ISR_DMA_Tick );

	powers.Trigger_PWMs();
	
	powers.Trigger_DMAs();
	powers.Render();

	prev_millis = millis();
}

void App::Loop()
{
	usb_mon.Tick();
	
	if( tick_req )
	{
		tick_req = false;
		uint32_t tp = millis();
		float tl = tp - prev_millis;
		for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Tick( tl );
		prev_millis = tp;
	}
}

void App::ISR_DMA_Tick()
{
	powers.Trigger_DMAs();
	powers.Render();
	powers.Clear_DMA_IRQ();
	tick_req = true;
}
