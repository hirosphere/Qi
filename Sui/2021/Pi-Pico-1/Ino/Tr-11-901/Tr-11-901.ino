#include "App.h"

App app;

void setup()
{
	Serial.begin( 115200 );
	delay( 500 );
	Serial.println( "Tr-11-901" );
	
	app.Init();
}

void loop()
{
	app.Init();
}
