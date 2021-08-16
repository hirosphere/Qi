#ifndef _APP_H_
#define _APP_H_

#include "Field.h"
#include "Serial-Monitor.h"
#include "Power.h"

//    //

const int Train_Count = 8;


//    //

struct Train : public Fields
{
	Float Speed, Act, Target;
	Float Idle, Bias, Max;

	inline Train() : Fields( 6 ) {}
	void Init();

	float voltage();
	String To_String();
};


//    //

struct App
{
	virtual void Setup() = 0;
	virtual void Loop() = 0;

	static App & Get_Main_App();
};

struct Main_App : public App
{
	Train trains[ Train_Count ];
	Serial_Monitor usb_mon { "Tr-1", Serial, nullptr, & ks_mon };

	void Setup()  override;
	void Loop()  override;

	
	
	struct Key_Action : public Serial_Monitor::Key_Client
	{
		Key_Action( Main_App * app ) : app( * app ) {}
		String Act( char key ) override;
		Main_App & app;
		Train & train() { return app.trains[ train_sel ]; }
		Field & field() { return train().Get( field_sel ); }
		int train_sel = 0;
		String field_sel = "Speed";
	};

	Key_Action ks_mon { this };
};

void ISR_Tick();

//    //

extern int wm_isr_wait;

#endif
