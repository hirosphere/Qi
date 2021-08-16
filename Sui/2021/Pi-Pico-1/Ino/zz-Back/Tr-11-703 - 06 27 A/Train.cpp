#include "App.h"

struct
{
	Float::Profile idle { "V", 0.8f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile bias { "V", 1.2f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile speed { "km/h", 0.f, 0.f, 1200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile max { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
	Float::Profile vftype { "", 0.f, 0.f, 1.f, { 1.f, 1.f, 1.f, 1.f } };
}
profs;

void Train::Init()
{
	add( "Idle", Idle, profs.idle );
	add( "Bias", Bias, profs.bias );
	add( "Max", Max, profs.max );
	add( "Speed", Speed, profs.speed );
	add( "VF-Type", VF_Type, profs.vftype );

	waves[ 0 ] = Test_WG( 0 );
	waves[ 1 ] = Test_WG( 1 );
}

void Train::Tick( float tick_ms )
{
	_speed += ( Speed.value - _speed ) * 0.01f;
}

void Train::Render( Powers::Writer output )
{
	waves[ ( int ) VF_Type.value ] -> Render( * this, output );
}

float Train::voltage()
{
	float sv = ( _speed / Max.value ) * 12.f + Bias.value;
	float iv = Idle.value;
	float dir = ( float ) this->dir;
	
	return dir * ( Speed.value == 0 ? iv : sv );
}
