#include "App.h"

void Main_App::Setup()
{
	for( int i = 0; i < Train_Count; i ++ )
	{
		trains[ i ].Init();
		canvas.Set_Renderer( i, trains[ i ] );
	}
	
	powers.Init_Periph( 0, 0 );
	powers.Init_Periph( 1, 2 );
	powers.Init_Periph( 2, 4 );
	powers.Init_Periph( 3, 6 );
	// powers.Init_Periph( 4, 8 );
	// powers.Init_Periph( 5, 10 );
	// powers.Init_Periph( 6, 12 );
	// powers.Init_Periph( 7, 14, ::ISR_DMA_Tick );
	
	for( int i = 0; i < powers.Channel_Count; i ++ )
	{
		if( i < Canvas_Ch_Count ) powers.Select_Source( i, i );
	}
	
	powers.Start_PWMs();
	//powers.Trigger_DMAs();
}

void Main_App::Loop()
{
	usb_mon.Tick();
}

void Main_App::ISR_DMA_Tick()
{
	if( run )
	{
		powers.Trigger_DMAs();
		canvas.Render();
		powers.Clear_DMA_IRQ();
	}
}

static Main_App main_app;

App & App::Get_Main_App() { return main_app; }
