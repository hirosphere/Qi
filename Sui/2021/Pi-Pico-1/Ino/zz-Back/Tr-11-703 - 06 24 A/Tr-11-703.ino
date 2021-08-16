#include "App.h"
#include "hardware/gpio.h"


const int wm_pin = PICO_DEFAULT_LED_PIN;
int isr_mon_ctr = 0;
int wm_isr_wait = 0;
int isr_lock_detect = 1;

App app;

void setup()
{
	Serial.begin( 115200 );

	gpio_init( wm_pin );
	gpio_set_dir( wm_pin, GPIO_OUT );
	
	gpio_put( wm_pin, 1 );
	delay( 500 );
	gpio_put( wm_pin, 0 );
	delay( 500 );

	app.Setup();
}


void loop()
{
	app.Loop();

	isr_lock_detect = 1;
}

void ISR_DMA_Tick()
{
	if( isr_lock_detect -- <= 0 )  return;

	int wm_stat = millis() >> 10;
	gpio_put( wm_pin, wm_stat & 1 );
	isr_mon_ctr ++;
	app.ISR_DMA_Tick();
	for( int i = wm_isr_wait; i > 0 ; i -- )  for( int t = millis(); t == millis(); ) ;
	gpio_put( wm_pin, wm_stat & 2 );
}
