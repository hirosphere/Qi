#include "App.h"

static struct
{
	Float_Prof idle  { "V",     0.8f,  0.0f, 12.f,    { 0.01f, 0.1f, 0.5f, 1.f  } };
	Float_Prof bias  { "V",     1.2f,  0.0f, 12.f,    { 0.01f, 0.1f, 0.5f, 1.f  } };
	Float_Prof max   { "km/h",  250.f, 0.0f, 1200.f,  { 1.00f, 5.0f, 10.f, 50.f } };
	Float_Prof speed { "km/h",    0.f, 0.0f, 1200.f,  { 0.5f,  1.0f,  5.f, 10.f } };
	Float_Prof target{ "km/h",    0.f, 0.0f, 1200.f,  { 1.00f, 5.0f, 10.f, 50.f } };
	Float_Prof act   { "km/h/s",  0.f, -50.f,  50.f,  { 0.1f,  0.5f,  1.f, 10.f } };

	Float_Prof tfrq   { "Hz",  300.f,   0.f, 20000.f,  { 0.1f,  1.f,  10.f, 100.f } };
	Float_Prof vf_volume   { "%",  10.f,   0.f, 100.f,  { 0.2f,  1.f,  3.f, 10.f } };
	Float_Prof vf_type { "",     1.f,   0.f, 2.f,  { 1.f,  1.f,  1.f, 1.f } };
}
profs;


Train::Train()
:
	idle  ( "Idle", profs.idle ),
	bias  ( "Bias", profs.bias ),
	max   { "Max",  profs.max },
	speed { "Speed",  profs.speed },
	target { "Target",  profs.target },
	act   { "Act",  profs.act },

	tv1   { "TV1",  profs.tfrq },

	vf_type { "VF-Type",    profs.vf_type },
	vf_volume { "VF-Volume",  profs.vf_volume },

	fields
	{
		& idle, & bias, & max, & speed, & target, & act, & tv1
		, & vf_type, & vf_volume
	}

{
	vf_renderer = Create_Renderer( this, 1, 660.f );
}

float Train::motor_voltage()
{
	if( speed.value <= 0.f ) return idle.value;
	return ( 12.f - bias.value ) * ( speed.value / max.value ) + bias.value;
}

void Train::Render( uint32_t * output )
{
	vf_renderer->Render( output );
}

Field & Train::Get_Field( String name )
{
	for( int i = 0; i < index_len; i ++ ) if( fields[ i ]->name == name ) return * fields[ i ];
	return idle;
}

