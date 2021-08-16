#ifndef _POWER_H_
#define _POWER_H_

#include <stdint.h>

struct Renderer
{
	void Render( uint32_t * output ) {};
};

struct Canvas_Base
{
	virtual void Get_Channel( int ch, uint32_t * out[ 2 ] ) = 0;

	uint32_t buffer_len = 0;
	int cur_index = 0;
};

template< int Channel_Count, int Buffer_Length > struct Canvas : public Canvas_Base
{
	uint32_t buffers[ Channel_Count ][ 2 ][ Buffer_Length ] = { 0 };

	Canvas()
	{
		buffer_len = Buffer_Length;
	}

	void Get_Channel( int ch, uint32_t * out[ 2 ] ) override
	{
		if( ch >= Channel_Count || ch < 0 ) return;

		out[ 0 ] = buffers[ ch ][ 0 ];
		out[ 1 ] = buffers[ ch ][ 1 ];
	}
};


struct Power_Channels
{
	Power_Channels( int channel_count, Canvas_Base & canvas );
	void Select_Src( int ch, int src );

	Canvas_Base & canvas;
	struct Power_Channel * channels;
	int channel_count;
};


struct Power_Channel
{
	int pin_a = 0;
	uint32_t * buffer_pair[ 2 ] = {};
};



#endif
