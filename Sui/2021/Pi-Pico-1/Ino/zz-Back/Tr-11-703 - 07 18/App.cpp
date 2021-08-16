#include "App.h"
#include "arduino.h"

String dma_prof( Powers & pows )
{
	String rt = "\tDMAs :\n";
	for( int i = 0; i < Output_Count; i++ )
	{
		Powers::Output & o = pows.output[ i ];

		rt += String( "\t\t" )
			+ "ch : " + String( o.dma_ch )
			+ " src :  " + String( ( int ) & o.src, HEX )
			+ "\n"
		;
	}
	return rt;
}

String train_prof( Train * trains )
{
	String rt = "\tTrains :\n";
	for( int i = 0; i < Train_Count; i++ )
	{
		Train & tr = trains[ i ];

		rt += String( "\t\t" )
			+ "ch : " + String( tr._time_test )
			+ "\n"
		;
	}
	return rt;
}

String App::monitor_string()
{
	String rt = String( "" )
		+ "\tTrain_Count : " + String( Train_Count ) + "\n"
		+ "\tCanvas_Count : " + String( Canvas_Count ) + "\n"
		+ "\tOutput_Count : " + String( Output_Count ) + "\n"
		+ "\tPWM_Range : " + String( PWM_Range ) + "\n"
		+ "\tSample_Rate : " + String( Sample_Rate ) + "\n"
		+ "\tBuffer_Len : " + String( Buffer_Len ) + "\n"
		+ dma_prof( powers )
		+ train_prof( trains )
	;

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

	trains[ 0 ].Set_Schedule( "S 90 3.3, W 5, S 0 3.3, W 1, R, W 5" );
	trains[ 1 ].Set_Schedule( "S 90 3.0, W 5.5, S 0 3.0, W 1, R, W 5.5" );
	trains[ 2 ].Set_Schedule( "S 90 3.3, W 5, S 0 3.3, W 1, R, W 5" );
	trains[ 3 ].Set_Schedule( "S 90 3.3, W 5, S 0 3.3, W 1, R, W 5" );

	trains[ 0 ].test = 0;
	trains[ 1 ].test = 1;

	//

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
		uint32_t tl = tp - prev_millis;
		for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Tick( ( int32_t ) tl );
		prev_millis = tp;
	}
}

void App::ISR_DMA_Tick()
{
	powers.Trigger_DMAs();
	powers.Render();
	tick_req = true;
}
