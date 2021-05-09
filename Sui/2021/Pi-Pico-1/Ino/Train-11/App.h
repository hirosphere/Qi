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

inline void pwm_v( uint32_t * & dest, int16_t value )
{
	bool pol =  value >= 0;
	uint32_t a = pol ? value : 0;
	uint32_t b = pol ? 0 : - value;
	* dest ++ = b << 16 | a;
}

typedef uint32_t Wave_Buffer[ Canvas_Buffer_Size ];
typedef Wave_Buffer Double_Buffer[ 2 ];

class WaveCanvas
{
 public:

	WaveCanvas();
	inline uint32_t * Get_Buffer( int ch ) {  return Buffers[ ch ][ cur_index ];  }
	Double_Buffer Buffers[  Train_Count + DCC_Count  ];
	inline int Cur_Index() {  return cur_index;  }
	inline void Next() {  cur_index = cur_index ? 0 : 1;  }

 protected:

	int cur_index = 0;
};

class PWM_Channel
{
 public:

	void Init( int a_pin, WaveCanvas * canvas, void( * dma_handler )() = NULL );
	void SelectSource( int ch );
	void TestOut( float value );

	inline void Next_DMA( int index )
	{
		dma_channel_set_read_addr( dma_chan, buff[ index ], true );
	}

	static void Start_DMA();
	static uint32_t dma_ch_mask;
	static inline void Clear_IRQ() {  dma_hw->ints0 = PWM_Channel::prime_dma_chan_mask;  }
	static uint32_t prime_dma_chan_mask;

 protected:

	int slice;
	WaveCanvas * canvas;
	uint32_t * buff[ 2 ];
	void dma_init( void( * dma_handler )() );
	int dma_chan;
};

class Renderer
{
 public:
	static Renderer * Create( int type );
	virtual void Render( uint32_t * output ) = 0;
};

#endif
