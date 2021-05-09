#ifndef _APP_H_
#define _APP_H_

#include "stdlib.h"
#include "hardware/pwm.h"
#include "dma.h"
#include "arduino.h"



//    //

#define Serial_Addr "Tr1"

const int Train_Count = 8;
const int Analog_Count = 4;
const int DCC_Count = 2;
const int PWM_Ch_Count = 4;

// 125MHz / 2500 = 50kHz  //
const int PWM_Range = 2500;
const float Sample_Rate = 50000.f;
const int Canvas_Buffer_Size = 500;
const int Canvas_Channel_Count = 4;
const float Tick_Rate = 100.f;   // Hz  //


//  //


typedef uint32_t Wave_Buffer[ Canvas_Buffer_Size ];
typedef Wave_Buffer Double_Buffer[ 2 ];

inline void pwm_i( uint32_t * & dest, int16_t value )
{
	bool pol =  value >= 0;
	uint32_t a = pol ? value : 0;
	uint32_t b = pol ? 0 : - value;
	* dest ++ = b << 16 | a;
}

inline void pwm_f( uint32_t * & dest, float value )
{
	pwm_i( dest, ( int16_t ) ( value * ( float ) PWM_Range ) );
}



//  //

class Renderer;

class Wave_Canvas
{
 public:

	Wave_Canvas();
	void Set_Renderer( int ch, class Renderer * renderer );
	void Render();

	inline uint32_t * Get_Buffer( int ch ) {  return Buffers[ ch ][ cur_index ];  }
	Double_Buffer Buffers[  Canvas_Channel_Count  ];
	inline int Cur_Index() {  return cur_index;  }
	inline void Next() {  cur_index = cur_index ? 0 : 1;  }

 protected:

	int cur_index = 0;
	Renderer * renderers[ Canvas_Channel_Count ];
};


class PWM_Channel
{
 public:

	void Init( int a_pin, Wave_Canvas * canvas, void( * dma_handler )() = NULL );
	void Select_Source( int ch );

	inline void Next_DMA( int index )
	{
		dma_channel_set_read_addr( dma_chan, buff[ index ], false );
	}

	void Test_Out( float value );
	void Test();

	static inline void Start_Slices() {  pwm_set_mask_enabled(  PWM_Channel::slices_mask  );  }
	static inline void Start_DMA() {  dma_start_channel_mask( PWM_Channel::dma_ch_mask );  }

	static uint32_t slices_mask;
	static uint32_t dma_ch_mask;
	static inline void Clear_IRQ() {  dma_hw->ints0 = PWM_Channel::prime_dma_chan_mask;  }
	static uint32_t prime_dma_chan_mask;

 protected:

	int slice;
	Wave_Canvas * canvas;
	uint32_t * buff[ 2 ];
	void dma_init( void( * dma_handler )() );
	int dma_chan;
};

class Renderer
{
 public:
	static Renderer * Create_T3( class Train * train, float freq );
	
	virtual void Render( uint32_t * output ) = 0;
};

class Train : public Renderer
{
 public:

	void Init( float freq, float acc, float speed, float wait_1, float wait_2 );
	void Tick();

	void Speed( float value );

	float target = 90.f;
	float acc = 0.f;
	float limit = 180.f;

	float speed = 0.f;
	float act = 0.f;

	float max = 240.f;
	float bias = 1.2f;
	float idle = 0.8f;
	float voltage = 0.f;
	bool forward = true;

 protected:

	virtual void Render( uint32_t * output );

	Renderer * renderer;
	class Player * player;
};

class Serial_Monitor
{
 public:

	void Init( class App * app, Stream * stream, String addr );
	void Tick();

 protected:

	class App * app;
	Stream * stream;
	String raddr, buff;
	bool is_current = false;

	void onkeystroke( char key );
	int ks_Curr_train = 0;
	int ks_curr_prop = 0;

	void curr_res();
	void mon_res();

};

class App
{
 public:

	Train trains[ Train_Count ];
	Wave_Canvas canvas;
	PWM_Channel pwm_channels[ PWM_Ch_Count ];

};

#endif
