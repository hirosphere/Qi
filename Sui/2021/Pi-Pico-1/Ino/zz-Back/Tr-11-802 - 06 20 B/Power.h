#ifndef _POWER_H_
#define _POWER_H_

#include <stdint.h>

struct Renderer
{
	virtual void Render( uint32_t * output, int len ) = 0;
};

struct Canvas
{
	struct Channel
	{
		Renderer * renderer = nullptr;
		virtual uint32_t * Get_Buffer( int cur_index ) = 0;
	};

	int cur_index = 0;
	
	int Next();
	void Render();

	void Set_Renderer( int ch_index, Renderer & rend );
	virtual Channel * Get_Channel( int ch_index ) = 0;

	virtual int buffer_len() = 0;
};

template< int Channel_Count, int Buffer_Length > struct Canvas_Tmpl : public Canvas
{
	struct : public Canvas::Channel
	{
		uint32_t buffers[ 2 ][ Buffer_Length ] {};
		uint32_t * Get_Buffer( int cur_index ) override { return buffers[ cur_index ]; }
	}
	channels[ Channel_Count ];

	Channel * Get_Channel( int ch_index ) override
	{
		return ( ch_index >= 0 && ch_index < Channel_Count ) ? & channels[ ch_index ] : nullptr;
	}

	int buffer_len()  override { return Buffer_Length; }
};


struct Powers
{
	Powers( Canvas & canvas, int32_t pwm_range );

	//    //

	struct Channel
	{
		Canvas::Channel * src = nullptr;
		
		int slice_num;
		int dma_ch = -1;
		
		void Init_Periph( Powers & powers, int a_pin );
		void DMA_Next( int cur_index );
	};

	//    //

	static const int ch_count = 8;

	int buffer_len;
	int32_t pwm_period;
	Canvas & canvas;
	Channel channels[ ch_count ];
	uint32_t slices_mask = 0;
	uint32_t dmas_mask = 0;

	//    //

	void Init_Periph( int ch, int a_pin );
	void Select_Source( int ch, int srcch );
	void Start_PWMs();
	void Trigger_DMAs();

};



#endif
