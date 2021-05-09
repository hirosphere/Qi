#ifndef _APP_H_
#define _APP_H_

#include "stdlib.h"
#include "hardware/pwm.h"
#include "dma.h"
#include "arduino.h"

const int Tick_Time = 25;
const int Train_Count = 4;
const int Analog_Count = 4;
const int DCC_Count = 2;
const int Canvas_Buffer_Size = 25000;
const int PWM_Ch_Count = 2;

// 125MHz / 5000 = 25kHz  //
const int PWM_Range = 5000;
const uint32_t Sample_Rate = 25000;


#endif
