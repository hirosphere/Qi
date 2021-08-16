#include "App.h"

static struct
{
	Float_Prof idle { "V", 0.f, 12.f, 0.8f, { 0.01f, 0.1f, 0.5f, 1.f } };
	Float_Prof bias { "V", 0.f, 12.f, 1.2f, { 0.01f, 0.1f, 0.5f, 1.f } };
	Float_Prof max { "km/h", 0.f, 1200.f, 240.f, { 1.f, 5.f, 10.f, 50.f } };
	Float_Prof speed { "km/h", 0.f, 1200.f, 0.f, { 0.5f, 1.f, 5.f, 10.f } };
	Float_Prof act { "km/h/s", -50.f, 50.f, 0.f, { 0.1f, 0.5f, 1.f, 10.f } };
}
profs;

void Train::Init()
{
	Add( "Idle", Idle, profs.idle );
	Add( "Bias", Bias, profs.bias );
	Add( "Max",  Max,  profs.max );
	
	Add( "Speed", Speed, profs.speed );

	Add( "Act",   Act,  profs.act );
	Add( "Target", Target, profs.speed );
}

float Train::voltage()
{
	return ( Speed.value > 0.f ) ?
		Bias.value + ( Max.value > 0.f ? Speed.value / Max.value : 0.f ) * 12.f :
		Idle.value
	;
}

String Train::To_String()
{
	return Speed.Full_String()
		+ " " + String( voltage() ) + "V"
	;
}
