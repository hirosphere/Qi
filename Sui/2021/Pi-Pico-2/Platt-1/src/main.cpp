#include <Arduino.h>

struct Good_UART
{
	void Init( int inst_num, uint32_t baudrate, uint8_t tx_pin, uint8_t rx_pin )
	{
		inst = inst_num == 0 ? uart0 : uart1;

		gpio_set_function( tx_pin, GPIO_FUNC_UART );
		gpio_set_function( rx_pin, GPIO_FUNC_UART );
		gpio_pull_up( rx_pin );

		int __unused actual = uart_set_baudrate( inst, baudrate );
		uart_set_hw_flow( inst, false, false );
		uart_set_format( inst, 8, 1, UART_PARITY_NONE );
		uart_set_fifo_enabled( inst, false );

		// int UART_IRQ = uart == uart0 ? UART0_IRQ : UART1_IRQ;
		// irq_set_enabled(UART_IRQ, true);
		// uart_set_irq_enables(uart, true, false);
	}

	void testput()
	{
		uart_puts( inst, "\nHello, uart interrupts\n");
	}

	uart_inst_t * inst;
};

struct Blinker
{
	void Init( uint8_t led_pin, uint32_t interval )
	{
		this->led_pin = led_pin;
		this->interval = interval;
		gpio_set_dir( led_pin, GPIO_OUT );
		gpio_set_dir( led_pin + 1, GPIO_OUT );
		prev_time = millis();
	}
	
	void tick()
	{
		digitalWrite( led_pin, HIGH );
		digitalWrite( led_pin + 1, LOW );
	}

	uint8_t led_pin;
	uint32_t interval;
	uint32_t prev_time;
};

struct  App
{
	Blinker bl_1;

	void Init()
	{
		Serial.begin( 115200 );
		Serial1.begin( 115200 );
		// serial_0.Init( 0, 115200, 16, 17 );
		gpio_pull_up( 17 );
		gpio_set_function( 16, GPIO_FUNC_UART );
		gpio_set_function( 17, GPIO_FUNC_UART );

		bl_1.Init( 0, 1000 );
	}

	void Tick()
	{
		if( Serial.available() )
		{
			int ch = Serial.read();
			Serial1.write( ch );
		}

		if( Serial1.available() )
		{
			int ch = Serial1.read();
			Serial.println( String( " " ) + String( ch ) + " を受信" );
		}
		
		bl_1.tick();
	}

	Good_UART serial_0;
};

App app;

void setup()
{
	app.Init();
}

void loop()
{
	app.Tick();

	// blink( 125, 8 );
	// blink( 250, 8 );
	// blink( 500, 8 );
	// blink( 1000, 8 );
	// blink( 2000, 8 );
}
