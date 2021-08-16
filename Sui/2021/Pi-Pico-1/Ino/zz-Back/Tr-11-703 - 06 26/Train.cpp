#include "App.h"

struct
{
	Float::Profile idle { "V", 0.8f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile bias { "V", 1.2f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile speed { "km/h", 0.f, 0.f, 1200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile max { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
}
profs;

void Train::Init()
{
	add( "Idle", Idle, profs.idle );
	add( "Bias", Bias, profs.bias );
	add( "Max", Max, profs.max );
	add( "Speed", Speed, profs.speed );
}

void Train::Render( Powers::Writer output )
{
	wg1.Render( * this, output );
}

float Train::voltage()
{
	float sv = ( Speed.value / Max.value ) * 12.f + Bias.value;
	float iv = Idle.value;
	float dir = ( float ) this->dir;
	
	return dir * ( Speed.value == 0 ? iv : sv );
}
