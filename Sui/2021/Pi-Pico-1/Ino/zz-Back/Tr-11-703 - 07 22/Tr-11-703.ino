#include "App.h"
#include "hardware/gpio.h"


const int wm_pin = PICO_DEFAULT_LED_PIN;
bool isr_lock_detect = true;

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
	isr_lock_detect = false;
}

void ISR_DMA_Tick()
{
	int wm_stat = millis() >> 10;
	gpio_put( wm_pin, wm_stat & 1 );

	if( isr_lock_detect == false ) app.ISR_DMA_Tick();
	app.Clear_DMA_IRQ();
	
	gpio_put( wm_pin, wm_stat & 2 );
	
	isr_lock_detect = true;
}
