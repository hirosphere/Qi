
#include "App.h"

void Lamp::Init( int pin_a, int period )
{
	this->pin_a = pin_a;
	this->pin_b = pin_a + 1;
	this->period = period;

	gpio_set_function( pin_a, GPIO_FUNC_PWM );
	gpio_set_function( pin_b, GPIO_FUNC_PWM );

	slice_num = pwm_gpio_to_slice_num( pin_a );
	pwm_set_wrap( slice_num, PWM_Range - 1 );
	pwm_set_enabled( slice_num, true );
}

void Lamp::Tick()
{
	if( timer <= 0 )  value = 1.f;
	update();
	value *= 0.93f;

	if( ( timer += Tick_Time ) >= period )  timer -= period;
}

void Lamp::Value( float value )
{
}

void Lamp::update()
{
	int v = ( int ) ( value * ( float ) PWM_Range );
	pwm_set_chan_level( slice_num, PWM_CHAN_A, v );
	pwm_set_chan_level( slice_num, PWM_CHAN_B, 0 );
}
