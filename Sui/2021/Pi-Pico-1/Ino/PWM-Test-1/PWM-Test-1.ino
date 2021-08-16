#include "app.h"


void setup()
{
	Serial.begin( 115200 );
	pinMode( PICO_DEFAULT_LED_PIN, OUTPUT );
	delay( 500 );
}

int ctr = 0;

void loop()
{
	Serial.println
	(
		String( "PWM-Test-1" )
		+ " " + String( ctr ++ )
		+ " " + String( random( 100000000 ) )
	);

	digitalWrite( PICO_DEFAULT_LED_PIN, HIGH );
	delay( 500 );
	
	digitalWrite( PICO_DEFAULT_LED_PIN, LOW );
	delay( 500 );
}
