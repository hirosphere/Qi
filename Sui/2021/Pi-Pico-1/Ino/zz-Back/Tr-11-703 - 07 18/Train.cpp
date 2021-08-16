#include "App.h"

struct
{
	Float::Profile idle { "V", 0.8f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile bias { "V", 1.2f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile speed { "km/h", 0.f, 0.f, 1200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile max { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };

	Float::Profile vftype { "", 2.f, 0.f, 15.f, { 1.f, 1.f, 1.f, 1.f } };
	Float::Profile freq { "Hz", 300.f, 0.f, 12000.f, { 0.1f, 1.f, 10.f, 100.f } };
	Float::Profile width { "%", 0.f, -105.f, 105.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile param1 { "", 0.f, 0.f, 100.f, { 0.1f, 1.f, 5.f, 10.f } };
}
profs;


void Train::Init()
{
	add( "Idle", Idle, profs.idle );
	add( "Bias", Bias, profs.bias );
	add( "Max", Max, profs.max );
	add( "Speed", Speed, profs.speed );
	add( "VF-Type", VF_Type, profs.vftype );
	add( "Volume", Volume, profs.width );
	add( "Freq", Freq, profs.freq );
	add( "Width", Width, profs.width );
	add( "Param-1", Param_1, profs.param1 );

	waves[ 0 ] = Test_WG( 0 );
	waves[ 1 ] = Test_WG( 1 );
	waves[ 2 ] = Test_WG( 2 );
	waves[ 3 ] = Test_WG( 3 );
}


void Train::Tick( int32_t tick_ms )
{
	_time_test += tick_ms;
	
	Seq::Tick( tick_ms );

	if( speed > 1.f ) speed += ( Speed.value - speed ) * 0.05f;
	
	else
	{
		float step = 0.05f;
		speed += ( speed < Speed.value ? step : - step );
		if( speed < 0.f ) speed = 0;
	}
}


void Train::Render( Powers::Writer output )
{
	Wave_Gen * wg = waves[ ( int ) VF_Type.value ];
	if( wg ) wg->Render( * this, output );
	else while( output ) output = 0;
}


float Train::voltage()
{
	float sv = ( speed / Max.value ) * 12.f + Bias.value;
	clip( sv, 0.f, 12.f );
	float iv = Idle.value;
	float dir = ( float ) this->dir;
	return dir * ( speed == 0 ? iv : sv );
}

