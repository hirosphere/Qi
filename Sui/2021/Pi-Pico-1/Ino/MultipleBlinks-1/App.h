#ifndef _APP_H_
#define _APP_H_

#include "pwm.h"
#include "dma.h"
#include "stdlib.h"
#include <Scheduler.h>

const int Tick_Time = 25;
const float PWM_Range = ( 192.f * 6.f ); 


class Lamp
{
 public:

	void Init( int pin_a, int period );
	void Tick();
	void Value( float value );

 protected:

	int pin_a, pin_b;
	int slice_num;
	int dir;  //  1 = fw , 2 = rev
	float value = 0.f;
	int timer = 0, period;

	void update();
	
};

#endif
