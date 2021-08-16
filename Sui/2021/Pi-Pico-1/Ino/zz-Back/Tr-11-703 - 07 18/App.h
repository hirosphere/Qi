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
		
		inline void operator = ( int16_t value )
		{
			if( value >= 0 )  * p ++ = value;
			else              * p ++ = ( - value ) << 16;
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
	uint32_t dma_triger_bits = 0;
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
	int32_t timeout = 0, test = -1;

	virtual void do_command( Word_Reader & cmd );

	//  client  //
};

struct Wave_Gen
{
	virtual void Render( struct Train & train, Powers::Writer output ) = 0;
};

struct Train : public Fields, public Powers::Renderer, public Seq
{
	Float VF_Type, Volume, Freq, Width, Param_1;
	Float Speed;
	Float Idle, Bias, Max;

	int dir = 1;
	float speed = 0.f;

	void Tick( int32_t tick_ms );

	Wave_Gen * waves[ 16 ] {};

	Train() : Fields( 9 ) {}
	void Init();	
	void Render( Powers::Writer output )  override;
	float voltage();

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
	key_monitor { this };
	
	Serial_Monitor usb_mon { "Tr-1", Serial, nullptr, & key_monitor };

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
