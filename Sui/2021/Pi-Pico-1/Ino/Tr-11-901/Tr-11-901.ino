#include <stdio.h>
#include "pico/stdlib.h"
#include "App.h"

App * app = Create_Sub_App();
//App * app = Create_Main_App();


void ISR_Canvas_Render()
{
	//tw_mon_isr_ent();
	//app->ISR_Canvas_Render();
	//tw_mon_isr_ext();
}

void setup()
{
	Serial.begin( 115200 );
	tw_mon_init();
	delay( 10 );

	for( int ct = 10; ct; ct -- )
	{
		gpio_put( PICO_DEFAULT_LED_PIN, 1 );
		delay( 1000 );
		gpio_put( PICO_DEFAULT_LED_PIN, 0 );
		delay( 1000 );
		Serial.println( String( ct ) );
	}


	app->Init();
}


void loop()
{
	app->Loop();
}
