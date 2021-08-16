#include "App.h"

void Main_App::Setup()
{
	for( int i = 0; i < Train_Count; i ++ )  trains[ i ].Init();
}

void Main_App::Loop()
{
	usb_mon.Tick();
}

static Main_App main_app;

App & App::Get_Main_App() { return main_app; }
