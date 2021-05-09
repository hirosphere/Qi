#include "App.h"

class App
{
 public:

	void Init()
	{
		Lamp_1.Init( 18, 2000 );
		Lamp_2.Init( 20, 2500 );
	}

	void Tick()
	{
		Lamp_1.Tick();
		Lamp_2.Tick();
	}

 protected:
	Lamp Lamp_1, Lamp_2;
};

App app;

void loop2();
void loop3();

void setup()
{
	Serial.begin( 11520 );
	app.Init();
	Scheduler.startLoop( loop2 );
}

// Task no.1: blink LED with 1 second delay.

void loop()
{
	delay( 10 );
}

// Task no.2: blink LED with 0.1 second delay.
void loop2()
{
	app.Tick();
	delay( Tick_Time );
}

void loop3()
{
	if( Serial.available() )
	{
		char c = Serial.read();
		if (c == '1')
		{
			//digitalWrite(LED_1_b, LOW);
			Serial.println("LED_1 正転");
		}
		if (c == '2')
		{
			//digitalWrite(LED_1_b, HIGH);
			Serial.println("LED_1 逆転");
		}
		if (c == '3')
		{
			//digitalWrite(LED_2_b, LOW);
			Serial.println("LED_2 正転");
		}
		if (c == '4')
		{
			//digitalWrite(LED_2_b, HIGH);
			Serial.println("LED_2 逆転");
		}
	}

	// IMPORTANT:
	// We must call 'yield' at a regular basis to pass
	// control to other tasks.
	yield();
}
