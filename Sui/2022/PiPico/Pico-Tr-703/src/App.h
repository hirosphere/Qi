#ifndef _APP_H_
#define _APP_H_

#include <stdint.h>
#include "Field.h"
#include "Serial-Monitor.h"

const int Train_Count = 8;
const int Canvas_Count = 8;
const int Output_Count = 8;

const int16_t PWM_Range = 3625;                 //  125 * 28  ( 58μS / 2 )  //
const float Sample_Rate = 34482.75862068966f;   //  125MHz / 3625 = 34.483kHz  //
const int Buffer_Len = 344;                     //  100.24Hz  //

//  const int16_t PWM_Range = 5000;
//  const float Sample_Rate = 25000.f;   //  125MHz / 5000 = 25kHz  //
//  const int Buffer_Len = 250;

const float PWM_Range_f = PWM_Range;


//    //

struct Powers
{
	struct Writer
	{
		Writer( uint32_t * p ) : p( p ) {}
		
		inline void operator = ( int32_t value )
		{
			if( value >= 0 )  * p ++ = value << 16;
			else              * p ++ = - value;
		}

		inline explicit operator bool() { return ct > 0 ? ct -- : false; }
		
		uint32_t * p;
		int ct = Buffer_Len;
	};

	struct Renderer
	{
		virtual void Render( Writer output ) = 0;
	};

	struct Canvas
	{
		Renderer * rend = nullptr;
		void Render( int cur_index );
		uint32_t buffer[ 2 ][ Buffer_Len ];
	};

	struct Output
	{
		void Init( Powers * pows, int a_pin, void ( on_dma_complete )() );
		void Set_DMA_Start( int cur_index );
		int dma_ch = -1;
		Canvas * src = nullptr;
		uint32_t * zero_buff;
	};

	Powers();

	void Set_Renderer( int canv_i, Renderer & rend );
	void Init_Output( int out_i, int a_pin, void ( on_dma_complete )() = nullptr );
	void Select_Output_Source( int out_i, int canv_i );
	void Trigger_PWMs();

	void Render();
	void Trigger_DMAs();
	void Clear_DMA_IRQ();

	Canvas canvas[ Canvas_Count ];
	Output output[ Output_Count ];

	int cur_index = 0;

	uint32_t pwm_trigger_bits = 0;
	uint32_t dma_trigger_bits = 0;
	uint32_t dma_irq_clear_bits = 0;
	
	uint32_t zero_buff[ Buffer_Len ] {};
};

//    //

struct Seq
{
	//  seq  //

	void Set_Schedule( String sch );
	void Tick( int32_t time_ms );

	String schedule;
	int pos = 0;
	int32_t test = -1;

	//  client  //

	virtual void seq_act( Word_Reader & cmd ) = 0;
	bool seq_is_timeout = false;
};

struct Wave_Gen
{
	virtual void Render( struct Train & train, Powers::Writer output ) = 0;
};

struct Train : public Fields, public Powers::Renderer, public Seq
{
	Float VF_Type, Volume, Freq, Width, Param_1;
	Float Limit, Act;
	Float Speed;
	Float Idle, Bias, Max;
	int dir = 1;

	bool run = false;
	float run_target;
	float act_speed = 0.f;

	float speed = 0.f;
	String runstatestr();

	void Tick( int32_t tick_ms );

	Wave_Gen * waves[ 16 ] {};

	Train() : Fields( 13 ) {}
	void Init();	
	void Render( Powers::Writer output )  override;
	float voltage();
	int16_t pwm_voltage()  { return ( voltage() / 12.f * PWM_Range_f ); }

	//  seq client //
	
	void seq_act( Word_Reader & cmd )  override;

	int32_t timeout = 0;
	enum { seq_time, seq_speed } seq_mode = seq_time;
	uint32_t _time_test = 0;
};

Wave_Gen * Test_WG( int i );

//    //

struct App
{
	void Setup();
	void Loop();
	void ISR_DMA_Tick();
	void Clear_DMA_IRQ()  {  powers.Clear_DMA_IRQ();  }

	Powers powers;
	Train trains[ Train_Count ];
	uint32_t prev_millis;
	bool tick_req = true;

	bool isr_lock_detect = false;
	
	//    //
	
	struct Key_Monitor: public Serial_Monitor::Key_Client
	{
		App & app;
		int train_sel = 0;
		String field_sel = "Idle";

		Key_Monitor( App * app ) : app( * app ) {}

		Train & train() { return app.trains[ train_sel ]; };
		Field & field() { return train().get( field_sel ); };

		String Act( char key )  override;
	}
	usb_key_monitor { this },
	uart_1_key_monitor { this };

	struct Line_Command_Receiver : public Serial_Monitor::Line_Client
	{
		App & app;
		Line_Command_Receiver( App * app ) : app( * app ) {}
		String Act( Word_Reader & words );
	}
	usb_line_command_receiver { this },
	uart_1_line_command_receiver { this };
	
	Serial_Monitor usb_mon { "Tr1", Serial, & usb_line_command_receiver, & usb_key_monitor };
	Serial_Monitor uart_1_mon { "Tr1", Serial1, & uart_1_line_command_receiver, & uart_1_key_monitor };

	String monitor_string();
};

//    //

void ISR_DMA_Tick();

//    //

inline void clip( float & value, float min = -1.f, float max = 1.f )
{
	if( value < min ) value = min;
	else if( value > max ) value = max;
}

#endif
