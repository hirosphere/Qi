#include "App.h"

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
		case 'g':  field_sel = "Null";  break;

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

		case ',':  train().dir = 1  ;  break;
		case '.':  train().dir = -1  ;  break;
	}

	int dir = train().dir;

	return String( " " )
		+ "Train-" + String( train_sel )
		+ " " + field().fullstring()
		+ " ( "
			+ String( dir == 0 ? "--" : dir == 1 ? "<--  " : " --> " )
			+ String( train().voltage() ) + "V"
		+ " )"
	;
}
