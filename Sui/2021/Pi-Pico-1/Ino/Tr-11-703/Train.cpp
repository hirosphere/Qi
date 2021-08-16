#include "App.h"

struct
{
	Float::Profile idle { "V", 0.8f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile bias { "V", 1.2f, 0.f, 12.f, { 0.05, 0.1f, 0.5f, 1.f } };
	Float::Profile max { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
	Float::Profile speed { "km/h", 0.f, 0.f, 1200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile limit { "km/h", 200.f, 0.f, 1200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile act { "km/h/s", 0.f, -50.f, 50.f, { 0.05f, 0.1f, 1.f, 5.f } };
	Float::Profile target { "km/h", 0.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
	Int::Profile run { "", 1, 0, 1, { 1, 1, 1, 1 } };

	Float::Profile vftype { "", 3.f, 0.f, 15.f, { 1.f, 1.f, 1.f, 1.f } };
	Float::Profile freq { "Hz", 300.f, 0.f, 12000.f, { 0.1f, 1.f, 10.f, 100.f } };
	Float::Profile volume { "%", 20.f, -200.f, 200.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile width { "%", 0.f, -105.f, 105.f, { 0.1f, 1.f, 5.f, 10.f } };
	Float::Profile param1 { "", 0.f, 0.f, 100.f, { 0.1f, 1.f, 5.f, 10.f } };
}
profs;


void Train::Init()
{
	add( "Idle", Idle, profs.idle );
	add( "Bias", Bias, profs.bias );
	add( "Max", Max, profs.max );

	add( "Limit", Limit, profs.limit );
	add( "Speed", Speed, profs.speed );
	add( "Act", Act, profs.act );
	add( "Target", Target, profs.target );
	add( "Run", Run, profs.run );
	
	add( "VF-Type", VF_Type, profs.vftype );
	add( "Volume", Volume, profs.volume );
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
	//  seq  //

	_time_test += tick_ms;

	if( Run.value )
	{
		switch( seq_mode )
		{
			case seq_time:
				
				if( ( timeout -= tick_ms ) < 0 )
				{
					seq_is_timeout = true;
				}
				break;

			case seq_speed:
				
				if( ( Act.value > 0.f && act_speed >= run_target ) || ( Act.value < 0.f && act_speed <= run_target ) )
				{
					seq_is_timeout = true;
					act_speed >= run_target;
					Act.value = 0.f;
				}
				break; 
		}
		
		Seq::Tick( tick_ms );
	}

	//  train  //

	float acc = ( Act.value * ( float ) tick_ms / 1000.f );

	if( acc > 0.f )
	{
		act_speed += acc;
	}
	else if( acc < 0.f )
	{
		if( ( act_speed += acc ) < 0.f )  act_speed = 0.f;
	}

	speed = Speed.value + act_speed;
}

void Train::seq_act( Word_Reader & cmd )
{
	String w0 = cmd.Next();
	
	if( test >= 0 )  Serial.print( String( "Train " + String( test ) ) + " " +  String( pos ) + " " + w0 + " " );
	
	if( w0 == "W" )
	{
		seq_mode = seq_time;
		seq_is_timeout = false;
		
		float time = cmd.Next_Float();
		timeout += ( int32_t ) ( time * 1000 );

		if( test >= 0 )  Serial.println( String( time ) + "Sec" );
		return;
	}

	else if( w0 == "S" )
	{
		seq_mode = seq_speed;
		seq_is_timeout = false;
		
		run_target = cmd.Next_Float();
		Act.value = cmd.Next_Float();
		
		if( test >= 0 )  Serial.println( String( Target.value ) + "km/h " + String( Act.value ) + "km/h/s" );
		return;
	}

	else if( w0 == "R" )
	{
		dir = dir == 1 ? -1 : 1;
		if( test >= 0 )  Serial.println( dir == 1 ? "<--" : "-->" );
		return;
	}

	if( test >= 0 )  Serial.println( String( "Train " + String( test ) ) + " " +  String( pos ) + " " + w0 );
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

