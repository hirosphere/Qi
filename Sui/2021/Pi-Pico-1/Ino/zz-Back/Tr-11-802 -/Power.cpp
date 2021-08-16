#include "Power.h"

Power_Channels::Power_Channels( int channel_count, Canvas_Base & canvas )
	:	channel_count( channel_count ),
		canvas( canvas ),
		channels( new Power_Channel[ channel_count ] )
{}

void Power_Channels::Select_Src( int ch, int src )
{
	if( ch >= channel_count || ch < 0 )  return;
	canvas.Get_Channel( src, channels[ ch ].buffer_pair );
}
