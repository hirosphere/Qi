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

	for( int i = 0; i < Canvas_Count && i < Train_Count; i ++ )  powers.Set_Renderer( i, trains[ i ] );
	for( int i = 0; i < Output_Count && i < Canvas_Count; i ++ ) powers.Select_Output_Source( i, i );
	for( int i = 0; i < Output_Count; i ++  )
	{
		// bool h = i == ( Output_Count - 1 );
		bool h = i == 0;
		powers.Init_Output( i, i * 2, h ? ::ISR_DMA_Tick : nullptr );
	}

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
	tick_req = true;
}
