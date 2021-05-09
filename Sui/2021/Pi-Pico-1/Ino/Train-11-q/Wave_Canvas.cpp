#include "App.h"

static void bfill( Double_Buffer dbuf, float value )
{
	uint a = ( uint ) ( value >= 0.f ? value * ( float ) PWM_Range : 0 );
	uint b = ( uint ) ( value < 0.f ? - value * ( float ) PWM_Range : 0 );

	uint32_t * buff = dbuf[ 0 ];
	for( int c = Canvas_Buffer_Size * 2; c --; )
	{
		* buff ++ = ( a | b << 16 );
	}
}

Wave_Canvas::Wave_Canvas()
{
	for( int ch = 0; ch < Canvas_Channel_Count; ch ++ )  renderers[ ch ] = NULL;
	
	bfill( Buffers[ 0 ], 1.f );
	bfill( Buffers[ 1 ], -1.f );
	bfill( Buffers[ 2 ], 0.1f );
	bfill( Buffers[ 3 ], -0.1f );
}

void Wave_Canvas::Set_Renderer( int ch, Renderer * r )
{
	renderers[ ch ] = r;
}

void Wave_Canvas::Render()
{
	for( int ch = 0; ch < Canvas_Channel_Count; ch ++ )
	{
		Renderer * r = renderers[ ch ];
		if( r != NULL ) r->Render( Get_Buffer( ch ) );
	}
}

