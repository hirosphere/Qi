#include "App.h"

void App::Init()
{
	tw_mon_init();
}

void App::Loop()
{
	tw_mon_loop( true );


	
	tw_mon_loop( false );
}
