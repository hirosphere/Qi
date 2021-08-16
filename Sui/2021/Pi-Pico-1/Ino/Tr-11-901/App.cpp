#include "App.h"

struct Main_App  :  public App
{
	Main_App();

	void Init() override
	{
		Serial.println( App_Name );


		canvas.Set_Renderer( 0, & trains[ 0 ] );
		canvas.Set_Renderer( 1, & trains[ 1 ] );
		canvas.Set_Renderer( 2, & trains[ 2 ] );
		canvas.Set_Renderer( 3, & trains[ 3 ] );
		canvas.Set_Renderer( 4, & trains[ 4 ] );
		canvas.Set_Renderer( 5, & trains[ 5 ] );
		canvas.Set_Renderer( 6, & trains[ 6 ] );
		canvas.Set_Renderer( 7, & trains[ 7 ] );

		powers.Init_Channel( 0, 0 );
		powers.Init_Channel( 1, 2 );
		powers.Init_Channel( 2, 4 );
		powers.Init_Channel( 3, 6, ::ISR_Canvas_Render );

		powers.Select_Src( 0, 0 );
		powers.Select_Src( 1, 1 );
		powers.Select_Src( 2, 2 );
		powers.Select_Src( 3, 3 );

		powers.Start_Slices();
		ISR_Canvas_Render( false );
	}

	String mon()
	{
		return
		(
			String( App_Name )
			+ " 開始より " + String( millis() / 1000 ) + "秒経過"
			+ " - " + powers.Monitor()
			+ " - Tick " + String( isr_tick_ctr )
		);
	}

	void Loop() override
	{
		usb_mon.Tick();
	}



	uint isr_tick_ctr = 1;

	void ISR_Canvas_Render( bool is_dma_irq )  override
	{
		powers.DMA_Trigger();
		canvas.ISR_Render();

		if( is_dma_irq )  powers.Clear_DMA_IRQ();

		isr_tick_ctr ++;
	}

	//    //

	Power_Channels powers;
	Canvas canvas;
	Train trains[ Train_Count ];
	Serial_Monitor usb_mon;
};

struct Line_Oper : public Serial_Monitor::Line_Client
{
	Line_Oper( Main_App * app ) : app( * app ) {}

	String Act( Word_Reader & words )  override
	{
		String rt;
		for( int i = 1; words.Has_Next(); i ++ )  rt += ( String( i ) + " - " + words.Next() + " " );
		return rt;
	}

	Main_App & app;
};

struct Key_Oper : public Serial_Monitor::Key_Client
{
	Key_Oper( Main_App * app ) : app( * app ) {}

	String Act( char key )  override
	{
		switch( key )
		{
			case 'q':  train_sel = 0;  break;
			case 'w':  train_sel = 1;  break;
			case 'e':  train_sel = 2;  break;
			case 'r':  train_sel = 3;  break;
			case 't':  train_sel = 4;  break;
			case 'y':  train_sel = 5;  break;
			case 'u':  train_sel = 6;  break;
			case 'i':  train_sel = 7;  break;

			case 'A':  field_sel = "Idle";  break;
			case 'S':  field_sel = "Bias";  break;
			case 'D':  field_sel = "Max";  break;
			case 'a':  field_sel = "Speed";  break;
			case 's':  field_sel = "Target";  break;
			case 'd':  field_sel = "Act";  break;

			case 'j':  field_sel = "TV1";  break;
			case 'k':  field_sel = "VF-Type";  break;
			case 'l':  field_sel = "VF-Volume";  break;

			case 'b':  field().Up_Down( 0 );  break;

			case 'Z':  field().Up_Down( -1 );  break;
			case 'z':  field().Up_Down( -2 );  break;
			case 'c':  field().Up_Down( -3 );  break;
			case 'C':  field().Up_Down( -4 );  break;
			
			case 'X':  field().Up_Down( 1 );  break;
			case 'x':  field().Up_Down( 2 );  break;
			case 'v':  field().Up_Down( 3 );  break;
			case 'V':  field().Up_Down( 4 );  break;
		}

		return String( " " )
			+ "Train " + String( train_sel )
			+ " " + field().Full_String()
		;
	}

	Main_App & app;
	Train & train() { return app.trains[ train_sel ]; }
	Field & field() { return train().Get_Field( field_sel ); }
	int train_sel = 0;
	String field_sel = "Speed";
};


Main_App::Main_App() :
	powers( canvas ),
	usb_mon( Serial_Addr, Serial, new Line_Oper( this ), new Key_Oper( this ) )
{}

App * Create_Main_App() {  return new Main_App();  }
