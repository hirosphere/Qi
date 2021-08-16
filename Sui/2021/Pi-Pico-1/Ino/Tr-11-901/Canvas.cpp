#include "arduino.h"
#include "App.h"

Canvas::Canvas()
{
}

void Canvas::Set_Renderer( int ch, Renderer * r )
{
	renderers[ ch ] = r;
}

Canvas::Buffer & Canvas::Get_Channel( int ch )
{
	return channels[ ch ][ cur_index ];
}

void Canvas::ISR_Render()
{
	cur_index = cur_index == 0 ? 1 : 0;

	for( int i = 0; i < Canvas_Channel_Count; i ++ )
	{
		Renderer * rdr = renderers[ i ];
		if( rdr != NULL )  rdr->Render( channels[ i ][ cur_index ] );
	}
}
