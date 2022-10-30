#include <Arduino.h>

const int wm_pin = PICO_DEFAULT_LED_PIN;

void setup()
{
	Serial.begin( 115200 );
	pinMode( wm_pin, OUTPUT );
	
	while( true )
	{
		Serial.println( "いいよ" );
		gpio_put( wm_pin, 1 );
		delay( 500 );
		gpio_put( wm_pin, 0 );
		delay( 500 );
	}
}

void loop()
{
	;
}