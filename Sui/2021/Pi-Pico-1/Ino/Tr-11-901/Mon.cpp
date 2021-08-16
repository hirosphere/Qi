#include <arduino.h>
#include "App.h"

#define  Mon_LED_Pin  PICO_DEFAULT_LED_PIN

static uint32_t isr_ent, isr_ext;

void tw_mon_init()
{
	pinMode( Mon_LED_Pin, OUTPUT );
	digitalWrite( Mon_LED_Pin, HIGH );
}

static int mask;

void tw_mon_isr_ent()
{
	mask = ( millis() >> 10 ) & 3;
	//digitalWrite( PICO_DEFAULT_LED_PIN, mask & 1 );
}

void tw_mon_isr_ext()
{
	//digitalWrite( PICO_DEFAULT_LED_PIN, mask & 2 );
}

