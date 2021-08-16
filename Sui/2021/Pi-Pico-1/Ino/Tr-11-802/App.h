#ifndef _APP_H_
#define _APP_H_

#include "Field.h"
#include "Serial-Monitor.h"
#include "Power.h"
#include "Powers.h"

//    //

const int Train_Count = 8;
const int Canvas_Ch_Count = 8;

// const uint32_t PWM_Range = 3250;     //  125MHz / 29μS   ( DCCパルスサンプル 58μS の半分 )
// const float PWM_Sample_Rate = 38461.53846153846;
// const int Canvas_Buff_Len = 385;   //  tick rate = 99.9Hz

const uint32_t PWM_Range = 5000;     //  125MHz / 40μS
const float PWM_Sample_Rate = 25000.f;
const int Canvas_Buff_Len = 250;   //  tick rate = 100Hz

const float PWM_Range_f = PWM_Range;

using NewPowers = PowersTemplate< Canvas_Ch_Count, 8, Canvas_Buff_Len, PWM_Range >;

//    //

struct Train : public Fields, public Renderer
{
	Float Speed, Act, Target;
	Float Idle, Bias, Max;

	inline Train() : Fields( 6 ) {}
	void Init();
	void Render( uint32_t * output, int len )  override;

	float voltage();
	String To_String();
};


//    //

struct App
{
	virtual void Setup() = 0;
	virtual void Loop() = 0;
	virtual void ISR_DMA_Tick() {}

	static App & Get_Main_App();
};

struct Main_App : public App
{
	Train trains[ Train_Count ];
	Serial_Monitor usb_mon { "Tr-1", Serial, nullptr, & ks_mon };
	Canvas_Tmpl
	<
		Canvas_Ch_Count,
		Canvas_Buff_Len
	>
	canvas;
	Powers powers { canvas, PWM_Range };
	
	NewPowers new_powers;
	struct NewTrain : public NewPowers::Renderer { void Render( uint32_t *, int ) {} };

	bool run = false;

	void Setup()  override;
	void Loop()  override;
	void ISR_DMA_Tick()  override;

	
	
	struct Key_Action : public Serial_Monitor::Key_Client
	{
		Key_Action( Main_App * app ) : app( * app ) {}
		String Act( char key ) override;
		Train & train() { return app.trains[ train_sel ]; }
		Field & field() { return train().Get( field_sel ); }
		Main_App & app;
		int train_sel = 0;
		String field_sel = "Speed";
	};

	Key_Action ks_mon { this };
};

void ISR_DMA_Tick();

//    //

extern int wm_isr_wait;

#endif
