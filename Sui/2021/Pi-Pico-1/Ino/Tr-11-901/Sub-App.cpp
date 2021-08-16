#include "App.h"

struct Sub_App : public App
{
	void Init()  override
	{
		Serial.println( "Sub-App" );
	}

	void Loop()  override
	{
		if( Serial.available() )
		{
			char ch = Serial.read();
			Serial.println( " - Sub-App だよ！" );
		}
	}

	void ISR_Canvas_Render( bool is_dma_irq )  override
	{
		;
	}
};


App * Create_Sub_App() {  new Sub_App();  }
