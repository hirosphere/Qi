#include "App.h"

typedef struct
{
	int type;
} Seq_Item;

class Player
{
 public:

	Player( Train * train )
	{
		this->train = train;
	}

	void Acc( float acc, float target )
	{
		;
	}

	void Wait( float time )
	{
		;
	}

	void Tick()
	{
		;
	}

	Train * train;
};


//    //

void Train::Init( float freq, float acc, float speed, float wait_1, float wait_2 )
{
	player = new Player( this );
	renderer = Renderer::Create_T3( this, freq );
}

void Train::Tick()
{
	player->Tick();

	acc = ( speed <= target ) ? act : -abs( act );

	if( acc > 0.f )
	{
		if( ( speed += acc / Tick_Rate ) > target )  speed = target;
	}
	else if( acc < 0.f )
	{
		if( ( speed += acc / Tick_Rate ) < 0.f )  speed = 0.f;
	}

	voltage = ( speed == 0.f ) ? idle : speed / max * 12.f + bias;
}

void Train::Render( uint32_t * output )
{
	renderer->Render( output );
}

void Train::Speed( float value )
{
	if( speed > target )  speed = target;
	else if( speed < 0.f ) speed = 0.f;
}
