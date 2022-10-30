#include "App.h"

String App::Line_Command_Receiver::Act( Word_Reader & words )
{
	String rt = "";
	while( words.Has_Next() )
	{
		rt += words.Next() + ", ";
	}
	return rt;
}

String App::Key_Monitor::Act( char key )
{
	switch( key )
	{
		//    //

		case 'q':  train_sel = 0;  break;
		case 'w':  train_sel = 1;  break;
		case 'e':  train_sel = 2;  break;
		case 'r':  train_sel = 3;  break;
		case 't':  train_sel = 4;  break;
		case 'y':  train_sel = 5;  break;
		case 'u':  train_sel = 6;  break;
		case 'i':  train_sel = 7;  break;

		//    //
		
		case 'a':  field_sel = "Idle";  break;
		case 's':  field_sel = "Bias";  break;
		case 'd':  field_sel = "Max";  break;
		case 'f':  field_sel = "Speed";  break;
		case 'g':  field_sel = "Act";  break;
		case 'h':  field_sel = "Limit";  break;

		case 'A':  field_sel = "VF-Type";  break;
		case 'S':  field_sel = "Volume";  break;
		case 'D':  field_sel = "Freq";  break;
		case 'F':  field_sel = "Width";  break;
		case 'G':  field_sel = "Param-1";  break;
		case 'H':  field_sel = "Null";  break;

		//    //
		
		case 'b':  field().updown( 0 );  break;

		case 'Z':  field().updown( -1 );  break;
		case 'X':  field().updown( 1 );  break;
		case 'z':  field().updown( -2 );  break;
		case 'x':  field().updown( 2 );  break;

		case 'c':  field().updown( -3 );  break;
		case 'v':  field().updown( 3 );  break;
		case 'C':  field().updown( -4 );  break;
		case 'V':  field().updown( 4 );  break;

		case '/':  train().dir = 1  ;  break;
		case '\\':  train().dir = -1  ;  break;

		case ':':  train().run = false  ;  break;
		case ']':  train().run = true  ;  break;

		case '1':  return String( "\n" ) + app.monitor_string();  break;
		case '2':  app.isr_lock_detect = ! app.isr_lock_detect;  return String( "\n" ) + app.monitor_string();  break;
		case '3':  app.powers.Trigger_DMAs();  break;
	}

	int dir = train().dir;

	return String( " " )
		+ "列車 " + String( train_sel )
		+ " " + field().fullstring()
		+ " ("
			+ " " + String( dir == 0 ? "---" : dir == 1 ? "F " : "R" )
			+ " " + String( train().voltage() ) + "V"
			+ " " + String( train().speed ) + "km/h"
			+ " " + String( train().runstatestr() )
		+ " )"
	;
}
