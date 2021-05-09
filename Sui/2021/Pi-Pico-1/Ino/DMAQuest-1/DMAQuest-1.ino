#include "App.h"

class App
{
 public:

	void Init()
	{
	}

	void Render()
	{
	}

	uint32_t mon_prev = 0;
	int mon_phase = 0;
	int mon_ctr = 3333;

	void Tick()
	{
		uint32_t cur = millis();
		if( ( cur - mon_prev ) >= 1000 )
		{
			mon_prev = cur;
			Serial.println( String( mon_ctr ++ ) );
		}

	}

 protected:

};

App app;

void setup()
{
	Serial.begin( 115200 );
	Serial.println( "DMA Quest" );
	app.Init();
}

void Gl_Next_DMA()
{
	//app.isr_Next_DMA();
}

void loop()
{
	app.Tick();
	delay( Tick_Time );
}
