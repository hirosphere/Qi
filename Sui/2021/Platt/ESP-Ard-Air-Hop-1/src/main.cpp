#include "BluetoothSerial.h"
#include <Arduino.h>

//const String App_Sig = "Air-Hop-1 - 2021-09-05 Qst 3";
const String App_Sig = "Air-Hop-1 - 2021-09-05";

const gpio_num_t Tx_Pin = GPIO_NUM_4;
const gpio_num_t Rx_Pin = GPIO_NUM_16;
// const gpio_num_t Tx_Pin = GPIO_NUM_25;
// const gpio_num_t Rx_Pin = GPIO_NUM_33;


void Signal_Init();
void Signal_Set( int state );


BluetoothSerial bt_serial;
uint32_t btou_ctr = 0, utob_ctr = 0;

uint8_t sig_state = 5;
void ss_inc()
{
	if( ++ sig_state > 5 ) sig_state = 1;
	Signal_Set( sig_state );
}

void setup()
{
	Serial.begin( 115200 );
	Serial1.begin( 115200, SERIAL_8N1, Rx_Pin, Tx_Pin );
	gpio_set_pull_mode( Rx_Pin, GPIO_PULLUP_ONLY );
	bt_serial.begin( App_Sig );
	
	Signal_Init();
	Signal_Set( sig_state );

	delay( 100 );
	
	Serial.println( String( "\n\n" ) + App_Sig );
}

uint32_t prev_time = 0;

void print_states()
{
	String s = App_Sig + "\n"
		+ "millis : " + String( millis() ) + "\n"
		+ "BT -> UART : " + String( btou_ctr ) + " - "
		+ "UART -> BT : " + String( utob_ctr )
		+ "\n"
	;
	Serial.println( s );
}

void loop()
{
	uint32_t time = millis();

	while( bt_serial.available() || Serial1.available() )
	{
		if( bt_serial.available() )
		{
			uint8_t ch = bt_serial.read();
			Serial1.write( ch );
			ss_inc();
			btou_ctr ++;
		}

		if( Serial1.available() )
		{
			uint8_t ch = Serial1.read();
			bt_serial.write( ch );
			utob_ctr ++;
		}
	}
	
	if( Serial.available() )
	{
		switch( Serial.read() )
		{
			default:  print_states();  break;
		}
	}

	if( ( time - prev_time ) >= 10000 )
	{
		prev_time = time;
		ss_inc();
	}
}

void Signal_Init()
{
	pinMode( 12, OUTPUT );
	pinMode( 14, OUTPUT );
	pinMode( 27, OUTPUT );
	pinMode( 26, OUTPUT );
}

void Signal_Set( int state )
{
	static const uint8_t patts[] = { 0, 2, 9, 13, 5, 1 };

	uint8_t patt = patts[ state ];

	digitalWrite( 26, patt & 4 );
	digitalWrite( 27, patt & 2 );
	digitalWrite( 14, patt & 1 );
	digitalWrite( 12, patt & 8 );
}
